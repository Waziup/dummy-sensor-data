FROM waziup/wazigate-static-server:latest

COPY node_modules/react/umd /root/ui/node_modules/react/umd
COPY node_modules/react-dom/umd /root/ui/node_modules/react-dom/umd
COPY index.html \
    docker-compose.yml \
    package.json \
    /root/ui/
COPY dist /root/ui/dist

#This command puts only the required files in the index.zip file which is good for production
RUN zip /index.zip /root/ui/docker-compose.yml /root/ui/package.json