const Job = require("../models/Job");
const { addJobToQueue, addSubmitToQueue } = require("../jobQueue");
const { generateFile } = require("../generateFile");
const fs = require("fs");
const http = require("http");
const path = require("path");

const runCode = async (request, response) => {
  let { language = "cpp", code, userInput } = request.body;

  if (code === undefined || !code) {
    return response
      .status(400)
      .json({ success: false, error: "Empty code body!" });
  }

  let job;
  try {
    // need to generate a c++ file with content from the request
    const filepath = await generateFile(language, code);

    job = await Job({ language, filepath, userInput }).save();
    const jobId = job["_id"];
    addJobToQueue(jobId);

    response.status(201).json({ sueccess: true, jobId });
  } catch (err) {
    return response.status(500).json(err);
  }
};

const submitCode = async (request, response) => {
  let { language = "cpp", code, userInput, problemId, userId } = request.body;

  if (code === undefined || !code) {
    return response
      .status(400)
      .json({ success: false, error: "Empty code body!" });
  }

  let job;
  try {
    // need to generate a c++ file with content from the request
    const filepath = await generateFile(language, code);

    job = await Job({ language, filepath, userInput }).save();
    const jobId = job["_id"];
    addSubmitToQueue(jobId, problemId, userId);

    response.status(201).json({ sueccess: true, jobId });
  } catch (err) {
    return response.status(500).json(err);
  }
};

const statusSubmit = async (request, response) => {
  if (!request.params.id) {
    return response.status(400).json("Missing required fields");
  }

  try {
    const job = await Job.findById(request.params.id);

    response.status(200).json({ job, success: true });
  } catch (error) {
    console.log(error);
    response.status(500).json({ error, success: false });
  }
};

const listAllSubmission = async (request, response) => {
  const userId = request.params.userid;
  const problemId = request.params.id;
  console.log(userId, problemId);
  if (!userId) return res.status(400).json("Missing required fields.");

  try {
    const submissions = await Job.find({
      userId,
      problemId,
      verdict: { $exists: true },
    }).sort({ submittedAt: -1 });
    response.status(200).json(submissions);
  } catch (error) {
    return response.status(500).json(error);
  }
};

const downloadSubmission = async (request, response) => {
  const id = request.params.id;

  if (!id) return response.status(400).json("Missing required fields");

  try {
    const job = await Job.findById(id);
    if (!job) {
      return res.status(400).json("File not found");
    }
    response.download(job.filepath);
  } catch (error) {
    return response.status(500).json(error);
  }
};

module.exports = {
  runCode,
  submitCode,
  statusSubmit,
  listAllSubmission,
  downloadSubmission,
};
