FROM node:20-alpine3.20

ARG MONGODB_URI
ARG SERVER_UPLOAD_URL
ARG GITHUB_SHA
ARG GITHUB_REF

ENV MONGODB_URI=${MONGODB_URI}
ENV SERVER_UPLOAD_URL=${SERVER_UPLOAD_URL}
ENV GITHUB_SHA=${GITHUB_SHA}
ENV GITHUB_REF=${GITHUB_REF}




WORKDIR /app

# Copy dependency files
COPY Server/package*.json ./
RUN npm ci
COPY Server .

CMD ["npm", "start"]
