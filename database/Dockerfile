FROM postgres:16

ENV POSTGRES_PASSWORD=ab
ENV POSTGRES_DB=capstone_db
ENV POSTGRES_USER=postgres

COPY ./db_entrypoint.sh ./custom-entrypoint.sh
# Convert Windows line endings to Unix using tr command
RUN tr -d '\r' < ./custom-entrypoint.sh > ./temp-script && \
    mv ./temp-script ./custom-entrypoint.sh && \
    chmod +x ./custom-entrypoint.sh

EXPOSE 5432

COPY db.sql ./

ENTRYPOINT [ "./custom-entrypoint.sh" ]