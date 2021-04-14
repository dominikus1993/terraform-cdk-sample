import { Construct } from 'constructs';
import { App, TerraformStack } from 'cdktf';
import { KubernetesProvider, Namespace, CronJob, CronJobConfig, CronJobSpec, Service } from './.gen/providers/kubernetes';

function creasteCronJob(stack: TerraformStack, appName: string) {
  const botsNamespace = new Namespace(stack, ' bots', {
    metadata: [{
      name: ' bots'
    }]
  })

  const metadata = { labels: { "app": appName } }
  const cron = new CronJob(stack, `${appName}-cron`, {
    metadata: [{
      name: appName,
      namespace: botsNamespace.metadata[0].name,
      ...metadata
    }],
    spec: [{
      schedule: "0 10 * * 1",
      jobTemplate: [{
        metadata: [metadata],
        spec: [
          {
            template: [{
              metadata: [metadata],
              spec: [{
                container: [{
                  name: "devnews-cli",
                  args: ["--article-quantity", "10"],
                  image: "dominikus1910/devnewscli:v1.3.0",
                  imagePullPolicy: "Always",
                  env: [
                    { name: "MicrosoftTeams__Enabled", value: "false" },
                    { name: "ConnectionStrings__Discord", valueFrom: [{ secretKeyRef: [{ key: "devnews", name: "discord" }] }] },
                    { name: "ConnectionStrings__Articles", valueFrom: [{ secretKeyRef: [{ key: "devnews", name: "articles" }] }] }
                  ],

                }],
                restartPolicy: "OnFailure",
                imagePullSecrets: [{ name: "dockerhub" }]
              }],

            }]
          }
        ]
      }]
    }]
  })
}

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);
    const ks8 = new KubernetesProvider(this, "test-k8s")

    const app
    // define resources here

  }
}

const app = new App();
new MyStack(app, 'terraform-cdk-sample');
app.synth();
