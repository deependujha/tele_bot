import 'dotenv/config';
import express from 'express';
import { Telegraf } from 'telegraf';

const app = express();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');
const PORT = process.env.PORT || 3000;

//method for invoking start command

bot.command('start', (ctx) => {
	console.log('this is my ctx: ', ctx);
	console.log('this is my ctx.from: ', ctx.from);
	bot.telegram.sendMessage(
		ctx.chat.id,
		'hello there! Deependu here from another side.',
		{}
	);
});

//method that displays the inline keyboard buttons

bot.hears('animals', (ctx) => {
	console.log(ctx.from);
	let animalMessage = `great, here are pictures of animals you would love`;
	ctx.deleteMessage();
	bot.telegram.sendMessage(ctx.chat.id, animalMessage, {
		reply_markup: {
			inline_keyboard: [
				[
					{
						text: 'dog',
						callback_data: 'dog',
					},
					{
						text: 'cat',
						callback_data: 'cat',
					},
				],
			],
		},
	});
});

//method that returns image of a dog

bot.action('dog', (ctx) => {
	bot.telegram.sendPhoto(ctx!.chat!.id, {
		source: 'res/dog.jpg',
	});
});

//method that returns image of a cat

bot.action('cat', (ctx) => {
	bot.telegram.sendPhoto(ctx!.chat!.id, {
		source: 'res/cat.jpeg',
	});
});

//method for requesting user's phone number

bot.hears('phone', (ctx, next) => {
	console.log(ctx.from);
	bot.telegram.sendMessage(
		ctx.chat.id,
		'Can we get access to your phone number?',
		requestPhoneKeyboard
	);
});

//method for requesting user's location

bot.hears('location', (ctx) => {
	console.log(ctx.from);
	bot.telegram.sendMessage(
		ctx.chat.id,
		'Can we access your location?',
		requestLocationKeyboard
	);
});

//constructor for providing phone number to the bot

const requestPhoneKeyboard = {
	reply_markup: {
		one_time_keyboard: true,
		keyboard: [
			[
				{
					text: 'My phone number',
					request_contact: true,
					one_time_keyboard: true,
				},
			],
			['Cancel'],
		],
	},
};
//constructor for proving location to the bot

const requestLocationKeyboard = {
	reply_markup: {
		one_time_keyboard: true,
		keyboard: [
			[
				{
					text: 'My location',
					request_location: true,
					one_time_keyboard: true,
				},
			],
			['Cancel'],
		],
	},
};

bot.launch();
