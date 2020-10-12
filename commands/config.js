const Discord = require("discord.js")
const db = require("quick.db")
const { cyan , green , red } = require('../embed.json')
 const ms = require('parse-ms');
const { truncate } = require("fs");
const fs = require('fs')
const yaml = require("js-yaml");
const { mainprefix , token , status , dpunishment } = yaml.load(fs.readFileSync("./config.yml"));

module.exports = {
    name: "config",
    description: "set guild anti raid config",
    run: async (client, message, args) => {
    let cmd = args[0];
   if(message.author.id === message.guild.ownerID) {    
    
    const guildicon = message.guild.iconURL();
    if(!cmd) {
        const embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag,message.author.displayAvatarURL())
        .setColor(cyan)
        .setDescription(`
        » ** Role Protection**
        ${mainprefix}config setrolecreatelimt <number>
       ${mainprefix}config setroledeletelimt <number>  
 
        » ** Channel Protection**
         ${mainprefix}config setchannelcreatelimt <number>
         ${mainprefix}config setchanneldeletelimt <number>

       » ** Members Protection**
         ${mainprefix}config setbanlimts <number>
         ${mainprefix}config setkicklimts <number>
    
        » ** Others Protections**
        ${mainprefix}config setactionlogs <#channel>
        ${mainprefix}config clearuser @user
        ${mainprefix}config show
        ${mainprefix}config setpunishment <roleremove/kick/ban>
     `)
 .setFooter(message.guild.name, guildicon)
  return message.channel.send(embed);
}
 if(cmd.toLowerCase() === 'show') {
   let rolelimt = db.get(`rolecreatelimt_${message.guild.id}`) 
   if(rolelimt === null) rolelimt = "Disabled :x:"
   let roledelete = db.get(`roledeletelimts_${message.guild.id}`) 
   if(roledelete === null) roledelete = "Disabled :x:"
   let logschannel = db.get(`acitonslogs_${message.guild.id}`)
   let logschannel2 = db.get(`acitonslogs_${message.guild.id}`)
   if(logschannel === null) logschannel = "Disabled :x:"
   else logschannel = `<#${logschannel2}>`
   let channelcreatelimts = db.get(`channelcreatelimts_${message.guild.id}`)
   if(channelcreatelimts === null) channelcreatelimts = "Disabled :x:"
   let channeldeletelimts = db.get(`channeldeletelimts_${message.guild.id}`)
   if(channeldeletelimts === null) channeldeletelimts = "Disabled :x:"
   let banlimts = db.get(`banlimts_${message.guild.id}`)
  if(banlimts === null) banlimts = "Disabled :x:"
  let kicklimts = db.get(`kicklimts_${message.guild.id}`)
  if(kicklimts === null) kicklimts = "Disabled :x:"
  let punishment = db.get(`punishment_${message.guild.id}`)
  if(dpunishment === null) dpunishment = "None"
  if(punishment === null) punishment = dpunishment
   let showembed = new Discord.MessageEmbed()

   .setAuthor(message.author.username, message.author.displayAvatarURL())
   .setTitle(`⚙️ ${message.guild.name} Config   `)
   .setColor(cyan)
   .addField('Role Create Limts', rolelimt, true)
   .addField('Role Delete Limts', roledelete, true)
   .addField(`Aciton Logs Channel`, logschannel, true)
   .addField(`Channel Create Limts`, channelcreatelimts, true)
   .addField(`Channel Delete Limts`, channeldeletelimts, true)
   .addField(`Ban Limts`, banlimts, true)
   .addField(`Kick Limts`, kicklimts, true)
   .addField(`Punishment`, punishment, true)
    .setFooter(message.guild.name, guildicon)
    return message.channel.send(showembed);
 }
 if(cmd.toLowerCase() === 'setrolecreatelimt') {
let rolecreate = args.slice(1).join(" ");
if(!rolecreate) {
 let missing = new Discord.MessageEmbed()
 .setAuthor(message.author.username, message.author.displayAvatarURL())
 .setColor(red)
 .setDescription(`** an invaild usage**\nconfig setrolecreatelimt (number)`)
 .setFooter(message.guild.name, guildicon)

  return message.channel.send(missing);
}
if(isNaN(rolecreate)) {
  let missing = new Discord.MessageEmbed()
  .setAuthor(message.author.username, message.author.displayAvatarURL())
  .setDescription(`** an invaild usage (Cannot be words only numbers)**\nconfig setrolecreatelimt (number)`)
  .setColor(red)
  .setFooter(message.guild.name, guildicon)
return message.channel.send(missing);
}
db.set(`rolecreatelimt_${message.guild.id}`, rolecreate)
let done = new Discord.MessageEmbed() 
.setAuthor(message.author.username, message.author.displayAvatarURL())
.setDescription(`Done SetRoleCreation Limts Has Been Set To ${rolecreate} ✅`)
.setColor(green)
.setFooter(message.guild.name, guildicon)
return message.channel.send(done);
}
if(cmd.toLowerCase() === 'setroledeletelimt') {
  let roledelete = args.slice(1).join(" ");
  if(!roledelete) {
   let missing = new Discord.MessageEmbed()
   .setAuthor(message.author.username, message.author.displayAvatarURL())
   .setColor(red)
   .setDescription(`** an invaild usage**\nconfig setroledeletelimt (number)`)
   .setFooter(message.guild.name, guildicon)
  
    return message.channel.send(missing);
  }
  if(isNaN(roledelete)) {
    let missing = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setColor(red)
    .setDescription(`** an invaild usage (Cannot be words only numbers)**\nconfig setroledeletelimt (number)`)
    .setFooter(message.guild.name, guildicon)
  return message.channel.send(missing);
  }
  db.set(`roledeletelimts_${message.guild.id}`, roledelete)
  let done = new Discord.MessageEmbed() 
  .setAuthor(message.author.username, message.author.displayAvatarURL())
  .setColor(green)
  .setDescription(`Done SetRoleDelete Limts Has Been Set To ${roledelete} ✅`)
  .setFooter(message.guild.name, guildicon)
  return message.channel.send(done);
  
}
if(cmd.toLowerCase() === 'setactionlogs') {
  let logs = message.mentions.channels.first();
  if(!logs) {
  let logsembed = new Discord.MessageEmbed()
  .setColor(red)
  .setAuthor(message.author.username, message.author.displayAvatarURL())
  .setDescription(`Please Mention an vaild channel`)
  .setFooter(message.guild.name, guildicon)
return message.channel.send(logsembed);
}
logs.send(`** Anit-Raid Logs Room **`)
db.set(`acitonslogs_${message.guild.id}`, logs.id)
let done = new Discord.MessageEmbed()
.setAuthor(message.author.username, message.author.displayAvatarURL())
.setColor(green)
.setDescription(`well done action-logs channel has been set to ${logs}`)
.setFooter(message.guild.name, guildicon)
return message.channel.send(done)
}
if(cmd.toLowerCase() === 'setchannelcreatelimt') {
  let rolecreate = args.slice(1).join(" ");
  if(!rolecreate) {
   let missing = new Discord.MessageEmbed()
   .setColor(red)
   .setAuthor(message.author.username, message.author.displayAvatarURL())
   .setDescription(`** an invaild usage**\nconfig setchannelcreatelimt (number)`)
   .setFooter(message.guild.name, guildicon)
  
    return message.channel.send(missing);
  }
  if(isNaN(rolecreate)) {
    let missing = new Discord.MessageEmbed()
    .setColor(red)
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setDescription(`** an invaild usage (Cannot be words only numbers)**\nconfig setchannelcreatelimt (number)`)
    .setFooter(message.guild.name, guildicon)
  return message.channel.send(missing);
  }
  db.set(`channelcreatelimts_${message.guild.id}`, rolecreate)
  let done = new Discord.MessageEmbed() 
  .setColor(green)
  .setAuthor(message.author.username, message.author.displayAvatarURL())
  .setDescription(`Done Channel Create Limts Has Been Set To ${rolecreate} ✅`)
  .setFooter(message.guild.name, guildicon)
  return message.channel.send(done);
}
if(cmd.toLowerCase() === 'setchanneldeletelimt') {
  let rolecreate = args.slice(1).join(" ");
  if(!rolecreate) {
   let missing = new Discord.MessageEmbed()
   .setAuthor(message.author.username, message.author.displayAvatarURL())
   .setColor(red)
   .setDescription(`** an invaild usage**\nconfig setchanneldeletelimt (number)`)
   .setFooter(message.guild.name, guildicon)
  
    return message.channel.send(missing);
  }
  if(isNaN(rolecreate)) {
    let missing = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setColor(red)
    .setDescription(`** an invaild usage (Cannot be words only numbers)**\nconfig setchanneldeletelimt (number)`)
    .setFooter(message.guild.name, guildicon)
  return message.channel.send(missing);
  }
  db.set(`channeldeletelimts_${message.guild.id}`, rolecreate)
  let done = new Discord.MessageEmbed() 
  .setAuthor(message.author.username, message.author.displayAvatarURL())
  .setColor(green)
  .setDescription(`Done Channel Delete Limts Has Been Set To ${rolecreate} ✅`)
  .setFooter(message.guild.name, guildicon)
  return message.channel.send(done);
}
if(cmd.toLowerCase() === 'setbanlimts') {
  let rolecreate = args.slice(1).join(" ");
  if(!rolecreate) {
   let missing = new Discord.MessageEmbed()
   .setAuthor(message.author.username, message.author.displayAvatarURL())
   .setColor(red)
   .setDescription(`** an invaild usage**\nconfig setbanlimt (number)`)
   .setFooter(message.guild.name, guildicon)
  
    return message.channel.send(missing);
  }
  if(isNaN(rolecreate)) {
    let missing = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setColor(red)
    .setDescription(`** an invaild usage (Cannot be words only numbers)**\nconfig setbanlimt (number)`)
    .setFooter(message.guild.name, guildicon)
  return message.channel.send(missing);
  }
  db.set(`banlimts_${message.guild.id}`, rolecreate)
  let done = new Discord.MessageEmbed() 
  .setColor(green)
  .setAuthor(message.author.username, message.author.displayAvatarURL())
  .setDescription(`Done Ban Limts Has Been Set To ${rolecreate} ✅`)
  .setFooter(message.guild.name, guildicon)
  return message.channel.send(done);
}
if(cmd.toLowerCase() === 'setkicklimts') {
  let rolecreate = args.slice(1).join(" ");
  if(!rolecreate) {
   let missing = new Discord.MessageEmbed()
   .setColor(red)
   .setAuthor(message.author.username, message.author.displayAvatarURL())
   .setDescription(`** an invaild usage**\nconfig setbanlimt (number)`)
   .setFooter(message.guild.name, guildicon)
  
    return message.channel.send(missing);
  }
  if(isNaN(rolecreate)) {
    let missing = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setColor(red)
    .setDescription(`** an invaild usage (Cannot be words only numbers)**\nconfig setkicklimt (number)`)
    .setFooter(message.guild.name, guildicon)
  return message.channel.send(missing);
  }
  db.set(`kicklimts_${message.guild.id}`, rolecreate)
  let done = new Discord.MessageEmbed() 
  .setColor(green)
  .setAuthor(message.author.username, message.author.displayAvatarURL())
  .setDescription(`Done Kick Limtis Has Been Set To ${rolecreate} ✅`)
  .setFooter(message.guild.name, guildicon)
  return message.channel.send(done);
}
if(cmd.toLowerCase() === 'clearuser') {
  let user = message.mentions.users.first()
if(!user) {
  return message.channel.send(`** Mention User **`);
}
db.delete(`executer_${message.guild.id}_${user.id}_kicklimts`) 
db.delete(`executer_${message.guild.id}_${user.id}_banlimts`)
db.delete(`executer_${message.guild.id}_${user.id}_rolecreate`)
db.delete(`executer_${message.guild.id}_${user.id}_roledelete`)
db.delete(`executer_${message.guild.id}_${user.id}_channelcreate`)
db.delete(`executer_${message.guild.id}_${user.id}_channeldelete`)
return message.channel.send(`Reseted User Limts for ${user}`);
}
 if(cmd.toLowerCase() === 'setpunishment') {
   let argsp = args[1];
   let embed = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setColor(cyan)
    .setDescription(`
    Punishment List:
    **kick**,**roleremove**,**ban**
    `)
    .setFooter(message.guild.name, guildicon)

   if(!argsp) return message.channel.send(embed)

   if(argsp.toLowerCase() === 'kick') {
let embed = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setDescription(`Punishment Was Changed to **Kick**`)
    .setColor(green)
    .setFooter(message.guild.name, guildicon)
db.set(`punishment_${message.guild.id}`, 'kick')
return message.channel.send(embed)
   }
   if(argsp.toLowerCase() === 'ban') {
    let embed = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setDescription(`Punishment Was Changed to **ban**`)
    .setColor(green)
    .setFooter(message.guild.name, guildicon)
db.set(`punishment_${message.guild.id}`, 'ban')
return message.channel.send(embed)
   }
  if(argsp.toLowerCase() === 'roleremove') {
    let embed = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setColor(green)
    .setDescription(`Punishment Was Changed to **roleremove**`)
    .setFooter(message.guild.name, guildicon)
db.set(`punishment_${message.guild.id}`, 'roleremove')
return message.channel.send(embed)

  } 
   
    }
  return;
  }
  return message.channel.send(new Discord.MessageEmbed().setTitle(`Only Guild OwnerShip Can Use That Command!`)).setColor(red)
}}
