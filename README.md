<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>
  <h1 align="center">Sky Bot Webhook NestJS</h1>
  <p align="center">Es el Webhook para registro de tramites documentarios via Facebook con preguntas y respuestas mediante DialogFlow usando el API Sky Bot</p>
 

## :ledger: Index

- [Pre-Requisitos](#pre-requisitos-)
- [Instalaci贸n](#instalaci贸n-)
  - [Environment](#Environment)
- [Desarrollo](#desarrollo-%EF%B8%8F)
  - [Unit-Test](#unit-test)
  - [E2E-Test](#E2E-test)
  - [Build](#build)
- [Despligue](#despliegue-)
- [Monitoreo](#monitoreo)
- [Analisis de Codigo](#analisis-de-codigo-)
- [Integraci贸n Continua](#integraci贸n-continua)
- [Logger](#logger)
- [Construido](#Construido-con-%EF%B8%8F)

## Comenzando 馃殌

_Estas instrucciones te permitir谩n obtener una copia del proyecto en funcionamiento en tu m谩quina local para prop贸sitos de desarrollo y pruebas._

## Pre-Requisitos 馃搵

_Software requerido_

```
NodeJS >= 14.X
NPM >= 8.X
NestJS >= 9.X
DialogFlow
Redis
```
_Servicios requeridos_

```
Dialogflow 
API Facebook MetaDevelopers
Auth0
```

_Software opcional_

```
Visual Studio Code ( O el editor de su preferencia)
```

## Instalaci贸n 馃敡

_Para ejecutar un entorno de desarrollo_

_Previamente ejecutar el comando en la terminal para descargar "node_modules" para el funcionamiento del proyecto_

```
 npm install
```

_Previamente a ejecutar el servidor en desarrollo configurar el archivo .env con las credenciales del servidor correos y base de datos , ejecutar :_

```
 npm run start:dev
```

_Dirigirse a la ruta http://localhost:3000/ donde tendra el Webhook levantado_


### Environment

_Se tiene el archivo `env.template` , el cual posee un ejemplo de cada valor de las valores de entorno para poder desplegarlas en nuestro propio ambiente local o cloud_

![Env](/docs/env/env.png)

## Desarrollo 鈿欙笍

_Las siguientes instrucciones serviran para ejecutar en su entorno local la pruebas unitarias realizadas para el proyecto_

### Unit-Test

_Para ejecutar todos los Unit Test desarrollados en Jest y reporte de cobertura de codigo ejecutar el comando_

```
 npm run test:cov
```

_La carpeta con la cobertura del codigo se creara en la raiz del proyecto con la siguiente ruta coverage/Icov-report/index.html el cual se puede visualizar_

![Unit Test Coverage](/docs/unit-test/unit-test-coverage.png)

### E2E-Test

_Los test fueron desarrollados en Jest con ayuda de SuperTest realizados a la API , para validar el funcionamiento adecuado en un entorno m谩s real_

_Previamente configurar los datos de pruebas en el archivo `e2e-config.spec.ts` de la carpeta `e2e`_

_Para ejecutar todos los E2E Test y reporte de cobertura de codigo ejecutar el comando_

```
 npm run test:e2e:cov
```

<!-- ![E2E Test Coverage](/docs/e2e-test/e2e-test-coverage.png) -->

### Build

_Para generar el build de producci贸n del proyecto ejecutar el siguiente comando:_

```
 npm run build
```

## Despliegue 馃懆馃徎鈥嶐煉?

_Para desplegar el proyecto mediante Docker tiene el archivo `docker-compose.prod.yaml` y la carpeta `docker`_

_Las cuales contienen los `Dockerfile` y dependencias necesarias para levantar el proyecto_

_Se dockerizo sobre un servidor de proxy inverso nginx el cual se expone en el puerto **80** por default_

_Para construir la imagen y ejecutarla tenemos el siguiente comando , el cual tambien tomara nuestras variable de entorno del archivo `env`_

_Ejecutar el siguiente comando en la raiz del proyecto_

```
 docker compose  -f docker-compose.prod.yaml --env-file .env up -d --build skybotwebhook nginx
```

![Docker 1](/docs/docker/docker-1.png)

![Docker 2](/docs/docker/docker-2.png)

_En caso de requerir volver a ejecutar el contenedor del proyecto previamente creado ejecutar el mismo comando_

## Monitoreo

_Adicionalmente en Docker posee Prometheus y Grafana para el monitorio de nuestra API_

_Se configuro por default el puerto **9090** para Prometheus y para Grafana se configuro el puerto **2525**_

_DashBoard para monitoreo del API en Grafana_

![Grafana 1](/docs/grafana/grafana-1.png)

![Grafana 2](/docs/grafana/grafana-2.png)

_Se agrego tambien LogStash , ElasticSearch con Kibana para la ingesta y monitoreo de LOGs_

_Se configuro por default el puerto **5061** por default para Kibana_

_Para implementar el ELK se tomo el repositorio de Deaviantony <a target="_blank" rel="noopener noreferrer" href="https://github.com/deviantony/docker-elk">Docker ELK</a>_

_Se construyo un DashBoard para monitoreo de LOGs con sus status y metricas_

![Kibana 1](/docs/kibana/kibana-1.png)

![Kibana 2](/docs/kibana/kibana-2.png)

_Para ejecutar los contenedores referentes al monitoreo ejecutar el comando_

```
 docker compose  -f "docker-compose.prod.yaml" up -d --build elasticsearch prometheus grafana kibana logstash setup
```

_Previamente inicializar el API en su contenedor indicado en el apartado de despliegue con la siguiente configuraci贸n en .env_

```
LOGSTASH_ENABLED= true
LOGSTASH_PORT= 50000
LOGSTASH_NODE_NAME= SKY_BOT_WEBHOOK_LOG
LOGSTASH_HOST= host.docker.internal
GRAFANA_PASSWORD='changeme'
ELASTIC_VERSION=8.5.0
KIBANA_SYSTEM_PASSWORD= 'changeme'
LOGSTASH_INTERNAL_PASSWORD= 'changeme'
ELASTIC_PASSWORD= changeme
```

_Si desea importar los dashboards construidos para este proyecto se encuentran en la carpeta ```dashboard``` siendo los archivos:_

- ***grafana-sky-bot-webhook.json*** para **Grafana**
- ***kibana-sky-bot-webhook.ndjson*** para **Kibana**

## Analisis de Codigo 馃敥

_**Pre requisitos**_

_En la raiz del proyecto se tiene el archivo *sonar-project.properties* el cual tiene las propiedades necesarias para ejecutarlo sobre un SonarQube_

_Configurar los apartados : *sonar.host.url* , *sonar.login* *sonar.password* con los datos de su instancia correspondiente o usar SonarCloud con su token correspondiente_

```
Sonaqube >= 9.X
```

![SonarQube Properties](/docs/sonar/sonar-properties.png)

_Las pruebas fueron realizas sobre *SonarQube 9.7* y *SonarCloud* para ejecutar el analisis de codigo ejecutar el comando para la instancia local:_

```
npm run sonar
```

_Reporte de Cobertura en SonarCloud_

![SonarQube Cloud 1](/docs/sonar/sonar-cloud-1.png)

![SonarQube Cloud 2](/docs/sonar/sonar-cloud-2.png)

![SonarQube Cloud 3](/docs/sonar/sonar-cloud-3.png)

## Integraci贸n Continua

_Se realizo un CI con SonarCloud para ejecuta de manera automatica los test_

_Se creo la carpeta `.github/workflows` con el archivo `build.yml` que contiene los pasos para desplegar mediante GitHub Actions nuestro CI_

<!-- ![CI 1](/docs/ci/ci-1.png) -->

_Posteriormente a la ejecuci贸n del workflow se generan los artifacts `reports-e2e-test` , `reports-unit-test` que contienen el reporte cobertura generado_

<!-- ![CI 2](/docs/ci/ci-2.png) -->


## Logger

_Se integro winston para reemplazar el logger de NestJS para realizar seguimiento y conservacion de los logs segun sea requerido_

_En el archivo `.env` se tienen los siguientes apartados configurados por default:_

```
APP_NAME=SKY_BOT_WEBHOOK
DATE_PATTERN=YYYY-MM-DD
MAX_SIZE=20m
MAX_DAYS=14d
```

_Por default la carpeta donde se guardan los logs es `LOG` , el formato configurado es JSON_

![LOGGER 1](/docs/logger/logger-1.png)

![LOGGER 2](/docs/logger/logger-2.png)

## Construido con 馃洜锔?

_Las herramientas utilizadas son:_

- [NestJS](https://nestjs.com/) - El framework para construir aplicaciones del lado del servidor eficientes, confiables y escalables.
- [NPM](https://www.npmjs.com/) - Manejador de dependencias
- [Jest](https://jestjs.io/) - Framework Testing para pruebas unitarias
- [SuperTest](https://www.testim.io/blog/supertest-how-to-test-apis-like-a-pro/) - Libreria para probar APIs bajo HTTP
- [Docker](https://www.docker.com/) - Para el despliegue de aplicaciones basado en contenedores
- [Nginx](https://www.nginx.com/) - Servidor de Proxy Inverso ligero
- [Graphana](https://grafana.com/) - Para la creaci贸n de DashBoard interactivos
- [Prometheus](https://prometheus.io/) - Aplicaci贸n para monitorear metricas en tiempo real
- [Redis](https://redis.io/) - Almac茅n de estructura de datos en memoria de c贸digo abierto , que se utiliza como base de datos, cach茅.
- [Kibana](https://www.elastic.co/es/kibana) - Permite visualizar los datos de Elasticsearch y navegar en el Elastic Stack
- [Logstash](https://www.elastic.co/es/logstash/) - Procesador de datos gratuito e ingesta de logs
- [ElasticSearch](https://www.elastic.co/es/what-is/elasticsearch) - Motor de b煤squeda y anal铆tica distribuido, gratuito y abierto
- [SonarQube](https://www.sonarqube.org/) - Evaluacion de codigo on premise
- [SonarCloud](https://sonarcloud.io/) - Evaluacion de codigo cloud
- [Visual Studio Code](https://code.visualstudio.com/) - Editor de Codigo
- [Prettier](https://prettier.io/) - Formateador de Codigo
- [MetaDevelopers](https://developers.facebook.com/) - Plataforma para integraci贸n y uso de API Facebook Oficial
- [DialogFlow](https://dialogflow.cloud.google.com) -Plataforma de comprensi贸n del lenguaje natural que se utiliza para dise帽ar e integrar una interfaz de usuario conversacional
- [TabNine](https://www.tabnine.com/) - Autocompletador de Codigo
- [Auth0](https://auth0.com/docs) -Servicio para autentificaci贸n y autorizaci贸n fiable y flexible
- [Winston](https://github.com/winstonjs/winston) - Logger para NodeJS

## Versionado 馃搶

Usamos [GIT](https://git-scm.com/) para el versionado.

## Autor 鉁掞笍

- **Jaime Burgos Tejada** - _Developer_
- [SkyZeroZx](https://github.com/SkyZeroZx)
- email : jaimeburgostejada@gmail.com
