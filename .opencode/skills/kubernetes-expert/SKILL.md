---
name: kubernetes-expert
description: Kubernetes deployment patterns. Pods, Deployments, Services, Ingress, HPA, config management, health checks.
---

# Kubernetes Expert

> Kubernetes is not a deployment tool. It\'s a platform for building deployment tools.

---

## 1. Core Objects

| Object | Purpose |
|--------|---------|
| **Pod** | Smallest unit, one or more containers |
| **Deployment** | Manages ReplicaSet, rolling updates |
| **Service** | Stable network endpoint for pods |
| **Ingress** | HTTP routing + TLS termination |
| **ConfigMap** | Non-sensitive configuration |
| **Secret** | Sensitive data (base64 encoded) |
| **HPA** | Horizontal Pod Autoscaler |
| **PVC** | Persistent Volume Claim |
| **CronJob** | Scheduled jobs |
| **ServiceAccount** | Pod identity for RBAC |

---

## 2. Production Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0       # Zero-downtime
  template:
    metadata:
      labels:
        app: api
        version: "1.2.0"
    spec:
      serviceAccountName: api-sa
      containers:
        - name: api
          image: ghcr.io/myorg/api:sha-abc123  # Pin to SHA, not :latest
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: production
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: url
          resources:
            requests:           # Scheduler uses these
              cpu: "100m"
              memory: "128Mi"
            limits:             # Hard cap
              cpu: "500m"
              memory: "512Mi"
          readinessProbe:
            httpGet:
              path: /health/ready
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /health/live
              port: 3000
            initialDelaySeconds: 15
            periodSeconds: 20
          lifecycle:
            preStop:
              exec:
                command: ["/bin/sh", "-c", "sleep 5"]  # Drain connections
      terminationGracePeriodSeconds: 30
```

---

## 3. Service + Ingress

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-service
spec:
  selector:
    app: api
  ports:
    - port: 80
      targetPort: 3000
  type: ClusterIP  # Use LoadBalancer for cloud LB

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress
  annotations:
    nginx.ingress.kubernetes.io/rate-limit: "100"
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  ingressClassName: nginx
  tls:
    - hosts: [api.example.com]
      secretName: api-tls
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 80
```

---

## 4. Horizontal Pod Autoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 2
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

---

## 5. Config & Secrets

```yaml
# ConfigMap
apiVersion: v1
kind: ConfigMap
metadata:
  name: api-config
data:
  LOG_LEVEL: "info"
  CACHE_TTL: "3600"

# Secret (use External Secrets Operator in real clusters)
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
data:
  url: cG9zdGdyZXNxbDovLy4uLg==  # base64
```

---

## 6. Health Check Endpoints

```ts
// Express
app.get("/health/live", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/health/ready", async (req, res) => {
  try {
    await db.$queryRaw`SELECT 1`;
    await redis.ping();
    res.json({ status: "ready" });
  } catch (err) {
    res.status(503).json({ status: "not ready", error: err.message });
  }
});
```

---

## 7. Useful Commands

```bash
# Deploy
kubectl apply -f k8s/
kubectl rollout status deployment/api

# Debug
kubectl get pods -n production
kubectl describe pod <pod-name>
kubectl logs <pod-name> --previous  # last crash logs
kubectl exec -it <pod-name> -- sh

# Rollback
kubectl rollout undo deployment/api
kubectl rollout history deployment/api

# Scale
kubectl scale deployment/api --replicas=5
```

---

## 8. Anti-Patterns

| ❌ Don\'t | ✅ Do |
|----------|-------|
| Use :latest tag | Pin to SHA |
| No resource limits | Always set requests + limits |
| No health probes | readiness + liveness required |
| Secrets in ConfigMap | Use Secret or External Secrets |
| Single replica in prod | Minimum 2 for HA |
| No PodDisruptionBudget | Protect against node drains |
