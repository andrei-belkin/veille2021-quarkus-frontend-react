FROM node:15-alpine as dev
WORKDIR /home/node
COPY . ./
RUN npm -g install react-scripts
RUN npm ci
EXPOSE 3000
ENTRYPOINT ["npm", "start"]

FROM node:15-alpine as build
WORKDIR /home/node
COPY --from=dev /home/node ./
RUN npm -g install react-scripts
RUN npm run build

FROM nginx:stable-alpine as prod
COPY --from=build /home/node/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
