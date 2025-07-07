#!/bin/bash

concurrently -i --names "backend,frontend" --prefix-colors "blue,green" "cd backend/ && npm run dev" "cd frontend/ && npm run dev";