FROM ubuntu:22.04
ENV DEBIAN_FRONTEND="noninteractive"
RUN apt-get update && apt-get install -y xvfb xdg-utils libxkbcommon-x11-0 libgtk-3-0 libxcursor1 libxss1 libgbm1 libcairo2 libatspi2.0-0 libdbus-glib-1-2 libgtk-3-dev libxt6 fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libgdk-pixbuf2.0-0 libpango-1.0-0 libpangocairo-1.0-0 libxcursor1 sudo mono-complete libsdl2-2.0 gnome-themes-standard
COPY ./dist/create-nes-game-linux /usr/bin/create-nes-game
# Preinstall mesen, nes-test, etc to make game builds faster.
COPY ./test/integration/test-roms/simple-nrom-128-c /dummy-image
RUN cd /dummy-image && ln -fs /usr/share/zoneinfo/America/New_York /etc/localtime && create-nes-game download-dependencies --assume-yes --debug && create-nes-game test && mkdir /app && mkdir ~/.config && rm -rf /dummy-image
WORKDIR /app

# Circleci specific thing, make it start at our entrypoint
LABEL com.circleci.preserve-entrypoint=true

ENV DISPLAY=":99"
RUN	printf '#!/bin/sh\nXvfb :99 -screen 0 1280x1024x24 &\nexec "$@"\n' | sudo tee /docker-entrypoint.sh && \
	sudo chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["/bin/sh"]
