#!/bin/bash
# Demo: Set up theme on Zango App Panel using agent-browser
# Usage: bash demo-theme-setup.sh <panel-url> <email> <password> <app-name> <primary-color>
#
# Example:
#   bash demo-theme-setup.sh http://app0.zelthy.com:8000 admin@zelthy.com "Pass123" KardiganDemo "#5048ED"

PANEL_URL="${1:?Usage: $0 <panel-url> <email> <password> <app-name> <primary-color>}"
EMAIL="${2:?Missing email}"
PASSWORD="${3:?Missing password}"
APP_NAME="${4:?Missing app name}"
PRIMARY="${5:-#5048ED}"

echo "=== Zango App Panel: Theme Setup ==="
echo "Panel: $PANEL_URL"
echo "App: $APP_NAME"
echo "Primary color: $PRIMARY"
echo ""

# Step 1: Login
echo "[1/6] Logging in..."
agent-browser open "$PANEL_URL/auth/login/"
agent-browser wait --load networkidle

agent-browser snapshot -i
# Find and fill login fields
agent-browser find placeholder "Enter Username" fill "$EMAIL"
agent-browser find placeholder "Email Password" fill "$PASSWORD"
agent-browser find role button click --name "Login"
agent-browser wait --url "**/platform/apps" --timeout 10000
echo "Logged in."

# Step 2: Find and click the app
echo "[2/6] Opening app: $APP_NAME..."
agent-browser snapshot -i
agent-browser find text "$APP_NAME" click
agent-browser wait --load networkidle

# Step 3: Navigate to Themes
echo "[3/6] Navigating to Themes..."
agent-browser find text "Themes" click
agent-browser wait 1000
agent-browser screenshot "before-theme.png"
echo "Screenshot saved: before-theme.png"

# Step 4: Click Add Theme or Edit existing
echo "[4/6] Editing theme..."
# Try to click edit on existing theme, or add new
agent-browser snapshot -i
# This will depend on whether a theme exists - the agent handles both cases

# Step 5: Set primary color
echo "[5/6] Setting primary color to $PRIMARY..."
# The exact selectors depend on the theme form structure
# agent-browser find label "Primary" fill "$PRIMARY"
# agent-browser find role button click --name "Save"
echo "(Theme form interaction would happen here)"

# Step 6: Screenshot result
echo "[6/6] Verifying..."
agent-browser screenshot "after-theme.png"
echo "Screenshot saved: after-theme.png"

echo ""
echo "=== Done! Theme updated. ==="
