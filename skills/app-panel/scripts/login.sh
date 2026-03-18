#!/bin/bash
# Login to Zango App Panel
# Usage: bash login.sh <panel-url> <email> <password>

PANEL_URL="${1:?Missing panel URL}"
EMAIL="${2:?Missing email}"
PASSWORD="${3:?Missing password}"

agent-browser open "$PANEL_URL/auth/login/" && agent-browser wait --load networkidle

agent-browser find placeholder "Enter Username" fill "$EMAIL"
agent-browser find placeholder "Email Password" fill "$PASSWORD"
agent-browser find role button click --name "Login"
agent-browser wait --url "**/platform/apps" --timeout 10000

echo "Logged in to $PANEL_URL"
agent-browser get title
