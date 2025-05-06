import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import { configureGemini } from "./geminiai-config.js";

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user)
      return res
        .status(401)
        .json({ message: "User Not Registered or Token Malfunction" });

    const chats = user.chats.map(({ role, content }) => ({
      role,
      content,
    }));

    chats.push({ content: message, role: "user" });
    user.chats.push({ content: message, role: "user" });

    console.log("Sending the following chat to Gemini API:", chats);
    const ai = configureGemini();
    const chatResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash", 
      contents: chats.map(chat => chat.content).join(" "),
    });

    console.log("Received chat response from Gemini:", chatResponse.text);
    user.chats.push({ content: chatResponse.text, role: "assistant" });
    await user.save();

    return res.status(200).json({ chats: user.chats });

  } catch (error) {
    console.log("Error in generating chat completion:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    return res.status(200).json({ message: "OK", chats: user.chats });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    //@ts-ignore
    user.chats = [];
    await user.save();
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};