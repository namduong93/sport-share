FROM postgres:16

ENV POSTGRES_PASSWORD=ab
ENV POSTGRES_DB=capstone_db
ENV POSTGRES_USER=postgres

RUN apt-get update && apt-get install -y dos2unix

COPY ./db_entrypoint.sh ./custom-entrypoint.sh
RUN dos2unix ./custom-entrypoint.sh
RUN chmod +x ./custom-entrypoint.sh

EXPOSE 5432

COPY db.sql ./

ENTRYPOINT [ "./custom-entrypoint.sh" ]