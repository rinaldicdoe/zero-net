.PHONY: help build up down logs restart clean rebuild

help: ## Tampilkan bantuan
	@echo "Available commands:"
	@echo "  make build       - Build Docker image"
	@echo "  make up          - Start containers"
	@echo "  make down        - Stop containers"
	@echo "  make logs        - Lihat logs"
	@echo "  make restart     - Restart containers"
	@echo "  make clean       - Remove containers dan images"
	@echo "  make rebuild     - Rebuild dan restart"
	@echo "  make prod-up     - Start dengan Nginx (production)"
	@echo "  make prod-down   - Stop production setup"

build: ## Build Docker image
	docker-compose build

up: ## Start containers
	docker-compose up -d

down: ## Stop containers
	docker-compose down

logs: ## Lihat logs
	docker-compose logs -f

restart: ## Restart containers
	docker-compose restart

clean: ## Remove containers dan images
	docker-compose down --rmi all -v

rebuild: ## Rebuild dan restart
	docker-compose up -d --build

prod-up: ## Start dengan Nginx (production)
	docker-compose -f docker-compose.prod.yml up -d

prod-down: ## Stop production setup
	docker-compose -f docker-compose.prod.yml down

prod-logs: ## Lihat production logs
	docker-compose -f docker-compose.prod.yml logs -f

prod-rebuild: ## Rebuild production
	docker-compose -f docker-compose.prod.yml up -d --build
