# ---------- Build Stage ----------
    FROM node:20-slim AS build
    WORKDIR /app
    
    # Copy and install full dependencies (including dev for build tools)
    COPY package.json package-lock.json ./
    RUN npm ci
    
    # Copy the rest of the codebase
    COPY . .
    
    # Compile TypeScript to JavaScript (assumes build script is set)
    RUN npm run build
    
    # ---------- Runtime Stage ----------
    FROM node:20-alpine AS runtime
    WORKDIR /app
    
    # Copy only required files from build stage
    COPY --from=build /app/package.json /app/package-lock.json ./
    COPY --from=build /app/dist ./dist
    
    # Install only production dependencies
    RUN npm ci --omit=dev
    
    EXPOSE 3000
    CMD ["node", "dist/index.js"]
    