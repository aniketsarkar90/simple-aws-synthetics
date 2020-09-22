import * as cdk from '@aws-cdk/core';
import * as synthetics from '@aws-cdk/aws-synthetics';
import { Schedule } from '@aws-cdk/aws-events';
import { Duration } from '@aws-cdk/core';
import { Test, Code } from '@aws-cdk/aws-synthetics';


export class SimpleAwsSyntheticsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // To supply the code from your local filesystem
    const canary1 = new synthetics.Canary(this, 'MyCanary', {
      test: synthetics.Test.custom({
        //code: new synthetics.AssetCode(__dirname+'/nodejs/node_modules/index.js'),
        code: new synthetics.InlineCode('Handler: pageLoadBlueprint.handler, Script: "var synthetics = require("Synthetics");\nconst log = require("SyntheticsLogger");\nconst pageLoadBlueprint = async function () {\n// INSERT URL here\nconst URL = \"https://www.google.com\";\n\nlet page = await synthetics.getPage();\nconst response = await page.goto(URL, {waitUntil: "domcontentloaded", timeout: 30000});\n//Wait for page to render.\n//Increase or decrease wait time based on endpoint being monitored.\nawait page.waitFor(15000);\nawait synthetics.takeScreenshot("loaded", "loaded");\nlet pageTitle = await page.title();\nlog.info("Page title: " + pageTitle);\nif (response.status() !== 200) {\n throw \"Failed to load page!\";\n}\n};\n\nexports.handler = async () => {\nreturn await pageLoadBlueprint();\n};\n'),
        //code: new synthetics.InlineCode(''),
        handler: 'index.handler', // must be 'index.handler'
      }),
    });

/*
    const canary = new synthetics.Canary(this, 'MyCanary', {
      test: synthetics.Test.custom({
        code: new synthetics.InlineCode(''),
        handler: 'index.handler', // must be 'index.handler'
      })
      //schedule: synthetics.Schedule.expression('rate(10 minutes)')
    });

    const bucket = new s3.Bucket(this, 'WebsiteBucket', {
      bucketName: 'simple-vue-cdk-app',
      websiteIndexDocument: 'index.html', //Specify the index document for our website
      blockPublicAccess: new s3.BlockPublicAccess({ restrictPublicBuckets: false }) //Allow public access to our bucket
    });
  */
  }

}
