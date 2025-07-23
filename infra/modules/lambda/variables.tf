variable "filename"             {}
variable "function_name"        {}
variable "handler"              {}
variable "runtime"              { default = "nodejs18.x" }
variable "environment_variables" { default = {} }
variable "dynamodb_table_arn"   { default = "" }
