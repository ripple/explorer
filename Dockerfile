FROM node:16
LABEL maintainer="Ripple Operations <ops@ripple.com>"

RUN mkdir /explorer
ADD . / explorer/
RUN npm i -g npm@8
RUN npm --prefix explorer install
RUN chmod +x /explorer/entrypoint.sh
WORKDIR /explorer

CMD /explorer/entrypoint.sh
