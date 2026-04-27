# Sample Terraform with intentional security issues for auditing

provider "aws" {
  region = "us-east-1"
}

# ISSUE 1 — S3 bucket with public access
resource "aws_s3_bucket" "data_bucket" {
  bucket = "my-company-data-bucket"
  acl    = "public-read"
}

# ISSUE 2 — Security group with open SSH
resource "aws_security_group" "web_sg" {
  name = "web-security-group"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ISSUE 3 — RDS without encryption
resource "aws_db_instance" "main_db" {
  identifier        = "production-db"
  engine            = "mysql"
  instance_class    = "db.t3.micro"
  allocated_storage = 20
  username          = "admin"
  password          = "password123"
  storage_encrypted = false
  publicly_accessible = true
}

# ISSUE 4 — IAM role with admin access
resource "aws_iam_role_policy_attachment" "admin" {
  role       = "my-app-role"
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}

# ISSUE 5 — Lambda with no VPC
resource "aws_lambda_function" "app" {
  filename      = "app.zip"
  function_name = "my-app"
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"
}