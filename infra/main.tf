provider "aws" {
  region = "us-west-2"
}

module "tasks_db" {
  source     = "./modules/dynamodb"
  table_name = "tasks"
  hash_key   = "taskId"
}

module "tasks_lambda" {
  source                = "./modules/lambda"
  filename              = "lambda.zip"
  function_name         = "tasks-handler"
  handler               = "tasks.handler"
  environment_variables = { TASKS_TABLE = module.tasks_db.table_name }
  dynamodb_table_arn    = module.tasks_db.table_arn
}

module "api_gateway" {
  source               = "./modules/api_gateway"
  api_name             = "tasks-api"
  lambda_invoke_arn    = module.tasks_lambda.invoke_arn
  lambda_function_name = module.tasks_lambda.function_name
  route_key            = "ANY /tasks"
}

module "cognito" {
  source        = "./modules/cognito"
  pool_name     = "myapp-userpool"
  client_name   = "myapp-client"
  callback_urls = ["http://localhost:3000"]
}

module "frontend" {
  source      = "./modules/s3_cloudfront"
  bucket_name = "myapp-react-frontend-demo-123456" # must be globally unique!
}

output "api_endpoint" {
  value = module.api_gateway.api_endpoint
}
output "cf_domain" {
  value = module.frontend.cf_domain
}
output "cognito_user_pool_id" {
  value = module.cognito.user_pool_id
}
output "cognito_client_id" {
  value = module.cognito.user_pool_client_id
}
