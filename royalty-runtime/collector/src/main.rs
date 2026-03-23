use axum::{routing::post, Json, Router, extract::State, http::StatusCode};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;

mod issuer;

#[derive(Deserialize)]
pub struct IngestRequest {
    pub session_id: String,
    pub primary_package: String,
    pub lineage_hash: String,
    pub lineage_payload_version: String,
    pub runtime_name: String,
    pub runtime_version: String,
    pub timestamp: i64,
    pub sdk_version: Option<String>,
    pub premium_path_enabled: Option<bool>,
    pub lease_id: Option<String>,
    pub payload_json: serde_json::Value,
}

#[derive(Serialize)]
pub struct IngestResponse {
    pub id: String,
    pub status: String,
    pub received_at: String,
}

#[derive(Serialize)]
pub struct ErrorResponse {
    pub status: String,
    pub message: String,
}

/// POST /v1/executions — accepts execution events and stores immutably
async fn ingest_execution(
    State(pool): State<PgPool>,
    Json(payload): Json<IngestRequest>,
) -> Result<Json<IngestResponse>, (StatusCode, Json<ErrorResponse>)> {
    let session_uuid = uuid::Uuid::parse_str(&payload.session_id).map_err(|_| {
        (StatusCode::BAD_REQUEST, Json(ErrorResponse {
            status: "error".into(),
            message: "Invalid session_id: must be a valid UUID".into(),
        }))
    })?;

    let is_verified = false; // TODO: Recompute via tracer
    let error_msg: Option<String> = Some("Server-side recomputation not yet implemented".into());
    let premium = payload.premium_path_enabled.unwrap_or(false);

    let record = sqlx::query!(
        r#"
        INSERT INTO execution_events
        (session_id, primary_package, lineage_hash, lineage_payload_version,
         runtime_name, runtime_version, event_timestamp, sdk_version,
         premium_path_enabled, lease_id, payload_json,
         hash_verified, verification_error)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING id, received_at
        "#,
        session_uuid, payload.primary_package, payload.lineage_hash,
        payload.lineage_payload_version, payload.runtime_name,
        payload.runtime_version, payload.timestamp, payload.sdk_version,
        premium, payload.lease_id, payload.payload_json,
        is_verified, error_msg
    )
    .fetch_one(&pool)
    .await
    .map_err(|e| {
        (StatusCode::INTERNAL_SERVER_ERROR, Json(ErrorResponse {
            status: "error".into(),
            message: format!("Database error: {}", e),
        }))
    })?;

    Ok(Json(IngestResponse {
        id: record.id.to_string(),
        status: "accepted".into(),
        received_at: record.received_at.to_string(),
    }))
}

#[tokio::main]
async fn main() {
    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://localhost/royalty_runtime".to_string());

    let pool = PgPool::connect(&database_url).await
        .expect("Failed to connect to database");

    sqlx::migrate!("./migrations").run(&pool).await
        .expect("Failed to run migrations");

    let app = Router::new()
        .route("/v1/executions", post(ingest_execution))
        .route("/v1/leases", post(issuer::issue_lease))
        .with_state(pool);

    println!("[ROYALTY COLLECTOR] Listening on 0.0.0.0:3000");
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}