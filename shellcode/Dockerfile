FROM 32bit/debian

RUN apt-get update
RUN apt-get -y install build-essential gdb

RUN mkdir /host
RUN echo "echo 0 > /proc/sys/kernel/randomize_va_space" > .bash_profile
RUN echo "cd /host > .bash_profile"

ENTRYPOINT /bin/bash
