FROM node:22 as dev-deps
WORKDIR /app
COPY package.json package.json
RUN npm install

FROM node:22 as builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
RUN npm run build --prod

FROM nginx:1.23.3 as prod
EXPOSE 80
COPY --from=builder /app/dist/mibanco-test/browser /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf 
COPY /nginx.conf /etc/nginx/conf.d/default.conf 
CMD ["nginx", "-g", "daemon off;"]

