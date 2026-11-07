# ==========================================
# ETAPA 1: CONSTRUCCIÓN (Builder)
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app

# ✅ 1. DECLARAR VARIABLES QUE SE NECESITAN DURANTE EL BUILD
ARG MONGODB_CNN
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL

# ✅ 2. CONVERTIRLAS EN VARIABLES DE ENTORNO PARA QUE NEXT.JS LAS LEA AL COMPILAR
ENV MONGODB_CNN=$MONGODB_CNN
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ==========================================
# ETAPA 2: PRODUCCIÓN (Runner)
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# También es buena práctica ponerlas aquí por si algún módulo las necesita al arrancar
ENV MONGODB_CNN=$MONGODB_CNN
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL

# Copiar archivos esenciales desde el builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 🚨 FIX PARA PDFKIT: Copiar manualmente las fuentes que Next.js omitió
COPY --from=builder /app/node_modules/pdfkit/js/standard-fonts ./node_modules/pdfkit/js/standard-fonts

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]