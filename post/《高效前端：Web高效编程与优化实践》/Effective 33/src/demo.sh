worker_processes  1;
events {
  worker_connections  1024;
}
http {
  include  mime.types;
  default_type  application/octet-stream;
  server_names_hash_bucket_size  64;
  access_log  off;

  sendfile  on;
  keepalive_timeout  65;

  server {
    listen  3001;
    location / {
      proxy_pass  http://127.0.0.1:8000;
      proxy_redirect  default;
      proxy_http_version  1.1;
      proxy_set_header  Upgrade $http_upgrade;
      proxy_set_header  Connection $http_connection;
      proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header  Host $http_host;
    }
  }
}

DOCKER OPTS = "--dns 8.8.8.8"