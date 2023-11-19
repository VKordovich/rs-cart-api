FROM node:18.12.1-alpine
WORKDIR /app
COPY * ./
RUN npm install && npm cache clean --force
RUN npm run build
USER node
EXPOSE 4000
ENTRYPOINT ["node", "dist/main.js"]
