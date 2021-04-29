FROM waziup/wazigate-static-server:latest

WORKDIR /root/

COPY node_modules/react/umd node_modules/react/umd
COPY node_modules/react-dom/umd node_modules/react-dom/umd
COPY index.html \
    favicon.ico

COPY dist dist

#This command puts only the required files in the index.zip file which is good for production
RUN zip /index.zip docker-compose.yml package.json