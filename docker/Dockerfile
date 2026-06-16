FROM node:22-bookworm-slim
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev && npx playwright install --with-deps chromium
COPY runner.mjs ./
WORKDIR /work
ENTRYPOINT ["node", "/app/runner.mjs"]
