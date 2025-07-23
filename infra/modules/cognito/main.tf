resource "aws_cognito_user_pool" "this" {
  name = var.pool_name
}

resource "aws_cognito_user_pool_client" "this" {
  name         = var.client_name
  user_pool_id = aws_cognito_user_pool.this.id
  generate_secret = false
  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]
  callback_urls                  = var.callback_urls
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows            = ["code"]
  allowed_oauth_scopes           = ["email", "openid", "profile"]
  supported_identity_providers   = ["COGNITO"]
}
