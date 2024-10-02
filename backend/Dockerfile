# Use Node.js for the backend
FROM node:16.20.2
WORKDIR /app
COPY package.json . 
RUN npm install
COPY . .
EXPOSE 8080
RUN chmod +x index.js
CMD ["node", "index.js"]  
