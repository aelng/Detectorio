const DiscordJS = require('discord.js')
const { MessageAttachment } = require('discord.js')
const { Client, Intents } = require('discord.js');
const client = new DiscordJS.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
})

const { CanvasRenderService } = require('chartjs-node-canvas')
const { downdetector } = require('downdetector-api');

let dat = ''
let val = 0
let bval = 0


async function main () {
  try {
    // Specifying the downdetector domain (some companies are not in the .com domain)
    const response = await downdetector(arguments[0],arguments[1]);
    //console.log(response)
    dat = response.reports[95].date
    val = response.reports[95].value
    bval = response.baseline[95].value
    let tim = dat.split('T')
    let timm = tim[1].split(':')
    let h = parseInt(timm[0])
    let m = timm[1]
    let amorpm = 'AM'
    if(h===0){h=12;} else {if(h>12){amorpm='PM'}h=h%12;}
    if(h<=4){h=12-(4-h)}else{h-=4}
    dat=h+':'+m+' '+amorpm;
  } catch (err) {
    console.error(err);
  }
}
const prefix = '!d'



client.on('messageCreate', (message) => {
  let args = message.content.split(' ');
  if(!args[0].startsWith(prefix) || message.author.bot) return;
  if(args[0] === '!dhelp'){
    let emb = new DiscordJS.MessageEmbed();
    emb.setTitle('Help');
    emb.addField('Commands', "!dhelp - opens the help page\n!dcheck <website> - prints the current and base reports", true)
    message.reply({content:'Here are all of the current Detectorio commands!', embeds:[emb], allowedMentions:{repliedUser:false}});
  } else if(args[0]==='!dcheck') {
    if(args.length==2) {
      let f = args[1].split('.')
      main(f[0],f[1]);
      let emb = new DiscordJS.MessageEmbed();
      setTimeout(() => { 
        emb.setTitle(f[0])
        emb.addField('Reports', "Last checked: " + dat + "\nReports: " + val + "\nBaseline: " + bval)
        message.reply({content:f[0] + ' downtime reports', embeds:[emb], allowedMentions:{repliedUser:false}}); }, 1300);

    } else {
      message.reply({content:'Incorrect usage! usage: !dcheck <website>', allowedMentions:{repliedUser:false}})
    }
  }
})

client.on('ready', () => {
    console.log('WORKS')
})

client.login('')