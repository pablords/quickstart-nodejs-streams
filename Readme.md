

## Após iniciar container db-stream, execute o comando abaixo para começar a exportar as metricas do banco MySql
docker exec db-stream /home/prometheus/prom-config-db.sh

## Iniciando app Web
`npm run web`

## Executando test de carga 
`npm run test:load`

### Referências 
1 - configurar exporter mysql
    https://grafana.com/oss/prometheus/exporters/mysql-exporter/?tab=installation
