import prom from "prom-client"

const register = new prom.Registry();
prom.collectDefaultMetrics({ register });

class MetricsController{

    async getMetrics(req, res){
        res.setHeader('Content-Type', register.contentType);
        res.send(await register.metrics());
    }
}

export default new MetricsController()