import type { CourseSpec } from "../types";

const CALC = { label: "AWS Pricing Calculator", url: "https://calculator.aws" };
const VANTAGE = { label: "Vantage: EC2 instance price comparison", url: "https://instances.vantage.sh" };
const COST_PILLAR = { label: "Well-Architected: Cost Optimization pillar", url: "https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html" };

export const awsPricing: CourseSpec = {
  slug: "aws-pricing",
  title: "AWS Pricing & FinOps",
  short: "AWS $",
  priority: 1,
  unitLabel: "lessons",
  tagline: "Read an AWS bill, predict it before you deploy, and cut it without breaking things.",
  description:
    "How AWS meters compute, storage, network and AI, the commitment models, the hidden network costs, GPU and Bedrock pricing, and the FinOps habits that keep unit cost down. Every lesson ends with a pricing calculator estimate.",
  bestVideo: [
    { label: "AWS re:Invent cost optimization talks", url: "https://www.youtube.com/results?search_query=AWS+re%3AInvent+cost+optimization" },
    { label: "Be A Better Dev: AWS pricing explained", url: "https://www.youtube.com/results?search_query=Be+A+Better+Dev+AWS+pricing" },
    { label: "Last Week in AWS (Corey Quinn)", url: "https://www.lastweekinaws.com" },
  ],
  bestRead: [CALC, VANTAGE, COST_PILLAR, { label: "FinOps Foundation framework", url: "https://www.finops.org/framework/" }],
  chapters: [
    {
      title: "How AWS bills you",
      group: "Basics",
      blurb: "Pricing dimensions, the free tier, and the tools that show where money goes.",
      vq: "AWS",
      read: [CALC, { label: "AWS Billing and Cost Management docs", url: "https://docs.aws.amazon.com/cost-management/latest/userguide/what-is-costmanagement.html" }],
      lessons: [
        "Pricing dimensions: time, requests, GB, GB-month",
        "Free tier and credits",
        "Cost Explorer",
        "Budgets and alerts",
        "Tagging and cost allocation",
        ["Estimating with the Pricing Calculator", { read: CALC }],
      ],
    },
    {
      title: "Compute pricing",
      group: "Services",
      blurb: "On-demand vs commitments vs spot, and when serverless is cheaper or not.",
      vq: "AWS",
      read: [{ label: "EC2 pricing", url: "https://aws.amazon.com/ec2/pricing/" }, VANTAGE],
      lessons: [
        "EC2 on-demand and instance families",
        ["Savings Plans vs Reserved Instances", { read: { label: "Savings Plans docs", url: "https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html" } }],
        ["Spot instances and interruption handling", { read: { label: "EC2 Spot docs", url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html" } }],
        "Graviton price-performance",
        ["Lambda pricing: requests and GB-seconds", { read: { label: "Lambda pricing", url: "https://aws.amazon.com/lambda/pricing/" } }],
        ["Fargate vs EC2 cost break-even", { read: { label: "Fargate pricing", url: "https://aws.amazon.com/fargate/pricing/" } }],
      ],
    },
    {
      title: "Storage and database pricing",
      group: "Services",
      blurb: "Storage classes, request costs and the database pricing models.",
      vq: "AWS",
      read: [{ label: "S3 pricing", url: "https://aws.amazon.com/s3/pricing/" }, { label: "RDS pricing", url: "https://aws.amazon.com/rds/pricing/" }],
      lessons: [
        "S3 storage classes and lifecycle rules",
        "S3 request and retrieval costs",
        "EBS: gp3 vs io2, snapshots",
        ["RDS and Aurora (incl. I/O-Optimized)", { read: { label: "Aurora pricing", url: "https://aws.amazon.com/rds/aurora/pricing/" } }],
        ["DynamoDB: on-demand vs provisioned", { read: { label: "DynamoDB pricing", url: "https://aws.amazon.com/dynamodb/pricing/" } }],
      ],
    },
    {
      title: "Network: the hidden bill",
      group: "Services",
      blurb: "Data transfer, cross-AZ traffic and NAT gateways, where most surprise bills come from.",
      vq: "AWS data transfer costs",
      read: [{ label: "AWS: overview of data transfer costs (architecture blog)", url: "https://aws.amazon.com/blogs/architecture/overview-of-data-transfer-costs-for-common-architectures/" }],
      lessons: [
        "Data transfer out to the internet",
        "Cross-AZ and cross-region traffic",
        ["NAT Gateway costs", { q: "AWS NAT gateway cost explained" }],
        "VPC endpoints and PrivateLink",
        ["CloudFront pricing and caching savings", { read: { label: "CloudFront pricing", url: "https://aws.amazon.com/cloudfront/pricing/" } }],
      ],
    },
    {
      title: "AI and GPU costs",
      group: "AI",
      blurb: "What GPUs and model APIs really cost, and when self-hosting pays off.",
      vq: "LLM inference cost",
      read: [{ label: "Amazon Bedrock pricing", url: "https://aws.amazon.com/bedrock/pricing/" }, VANTAGE],
      lessons: [
        ["GPU instances: g5, g6, p4, p5", { read: { label: "EC2 accelerated computing instances", url: "https://aws.amazon.com/ec2/instance-types/#Accelerated_Computing" } }],
        ["Bedrock: on-demand, batch, provisioned throughput", { read: { label: "Amazon Bedrock pricing", url: "https://aws.amazon.com/bedrock/pricing/" } }],
        ["SageMaker endpoints pricing", { read: { label: "SageMaker pricing", url: "https://aws.amazon.com/sagemaker/pricing/" } }],
        "Token cost modeling per feature",
        "Self-host vs API break-even",
        "Inferentia and Trainium",
      ],
    },
    {
      title: "FinOps practice",
      group: "Practice",
      blurb: "Habits that keep cost visible and falling as usage grows.",
      vq: "FinOps",
      read: [COST_PILLAR, { label: "FinOps Foundation framework", url: "https://www.finops.org/framework/" }],
      lessons: [
        "Unit economics: cost per user and per request",
        ["Rightsizing with Compute Optimizer", { read: { label: "AWS Compute Optimizer", url: "https://aws.amazon.com/compute-optimizer/" } }],
        "Cost anomaly detection",
        "Architecture cost reviews before launch",
        ["AWS vs GCP vs Vercel for your workloads", { q: "AWS vs GCP vs Vercel cost comparison" }],
      ],
    },
  ],
};
