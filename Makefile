.PHONY: help install dev deploy clean update outdated

# Default target
help:
	@echo "Available targets:"
	@echo "  make install    - Install dependencies with pnpm"
	@echo "  make dev        - Start local development server"
	@echo "  make deploy     - Deploy to Cloudflare Workers"
	@echo "  make clean      - Remove node_modules and generated files"
	@echo "  make update     - Update dependencies"
	@echo "  make outdated   - Check for outdated dependencies"

# Install dependencies
install:
	pnpm install

# Start development server
dev:
	pnpm dev

# Deploy to Cloudflare Workers
deploy:
	pnpm deploy

# Clean generated files
clean:
	rm -rf node_modules .wrangler

# Update dependencies
update:
	pnpm update

# Check for outdated dependencies
outdated:
	pnpm outdated
