
const fs = require('fs')
const { cyan , green , red } = require('./embed.json')
const yaml = require("js-yaml");
const { mainprefix , token , status , dpunishment } = yaml.load(fs.readFileSync("./config.yml"));
const Discord = require('discord.js')
const client = new Discord.Client();
const db = require('quick.db')
const { join } = require('path');
const { readdirSync } = require('fs');
client.commands= new Discord.Collection();
client.login(token)

  
client.on('ready', () => {
    client.user.setActivity(status, { type: 'PLAYING' });
    console.clear();
 
  console.log('\n\x1b[32m%s\x1b[0m', `          $[INFO]: Logged on ${client.user.tag}`);  
  console.log('\x1b[32m%s\x1b[0m', `           $[INFO]: PREFIX ${mainprefix}`);  
 });

 const commandFiles = readdirSync(join(__dirname, "commands")).filter(file => file.endsWith(".js"));

 for (const file of commandFiles) {
     const command = require(join(__dirname, "commands", `${file}`));
     client.commands.set(command.name , command);
 }
 
 client.on("message", async message => {
    let prefix = await db.get(`prefix_${message.guild.id}`);
   if(prefix === null) prefix = mainprefix;
       if(message.author.bot) return;
       if(message.channel.type === 'dm') return;
   
       if(message.content.startsWith(prefix)) {
           
      let premiumcheck = db.get(`blacklisted`)

      if(premiumcheck && premiumcheck.find(find => find.kid == message.author.id)) return message.channel.send(`you cant use the bot your blacklisted!!`);
 
           const args = message.content.slice(prefix.length).trim().split(/ +/);
   
           const command = args.shift().toLowerCase();
   
           if(!client.commands.has(command)) return;
   
   
           try {
               client.commands.get(command).run(client, message, args);
   
           } catch (error){
               console.error(error);
           }
        }
   })
  
     
client.on("roleCreate", async role => {
    const user = await role.guild.fetchAuditLogs({
        type: 'ROLE_CREATE'
    }).then(audit => audit.entries.first())
    const entry = user.executor
    let trustedusers = db.get(`trustedusers_${role.guild.id}`)
    if(trustedusers && trustedusers.find(find => find.user == entry.id)) {
    return console.log('Its Trusted User');
    } 
    db.add(`executer_${role.guild.id}_${role.guild.id}_rolecreate`, 1)

    let author = db.get(`executer_${role.guild.id}_${entry.id}_rolecreate`)
  let limts = db.get(`rolecreatelimt_${role.guild.id}`)
if(limts === null) {
    return console.log('shit');
}
let logs = db.get(`acitonslogs_${role.guild.id}`)

    if(author > limts) {
      let punishment = db.get(`punishment_${role.guild.id}`)
      if(punishment === null) punishment = dpunishment
    if(punishment === 'roleremove') {
    role.guild.members.cache.get(entry.id).roles.cache.map(userroles => {
    role.guild.members.cache.get(entry.id).roles.remove(userroles.id)
    db.delete(`executer_${role.guild.id}_${entry.id}_rolecreate`)
    console.log('trying to remove user roles..')
    let logsembed = new Discord.MessageEmbed()
    .setColor(cyan)
    .setTitle(`${entry.tag} was trying to raid ! [Breaking Role Delete Limts]`)
    return client.channels.cache.get(logs).send(logsembed);
    })
    }
    if(punishment === 'ban') {
    role.guild.members.cache.get(entry.id).ban()
    db.delete(`executer_${role.guild.id}_${entry.id}_rolecreate`)
    console.log('trying to ban the user..')
    let logsembed = new Discord.MessageEmbed()
    .setColor(cyan)
    .setTitle(`${entry.tag} was trying to raid ! [Breaking Role Create Limts]`)
    return client.channels.cache.get(logs).send(logsembed);
    }
    if(punishment === 'kick') {
    role.guild.members.cache.get(entry.id).kick()
    db.delete(`executer_${role.guild.id}_${entry.id}_rolecreate`)
    console.log('trying to kick the user..')
    let logsembed = new Discord.MessageEmbed()
    .setColor(cyan)
    .setTitle(`${entry.tag} was trying to raid ! [Breaking Role Create Limts]`)
    return client.channels.cache.get(logs).send(logsembed);
    }
    return;
    }
       let warn = db.get(`executer_${role.guild.id}_${entry.id}_rolecreate`)
       let logsembed = new Discord.MessageEmbed()

       .setTitle(`${entry.tag} Is Creating Roles.. [${warn || 0}/${author || 0}]`)
       .setColor(cyan)
       client.channels.cache.get(logs).send(logsembed)

});

client.on("roleDelete", async role => {
    const user = await role.guild.fetchAuditLogs({
        type: 'ROLE_DELETE'
    }).then(audit => audit.entries.first())
    const entry = user.executor 
    db.add(`executer_${role.guild.id}_${entry.id}_roledelete`, 1)

    let author = db.get(`executer_${role.guild.id}_${entry.id}_roledelete`)
  let limts = db.get(`roledeletelimt_${role.guild.id}`)
if(limts === null) {
    return console.log('shit');
}
let trustedusers = db.get(`trustedusers_${role.guild.id}`)
if(trustedusers && trustedusers.find(find => find.user == entry.id)) {
return console.log('Its Trusted User');
}
let logs = db.get(`acitonslogs_${role.guild.id}`)

if(author > limts) {
  let punishment = db.get(`punishment_${role.guild.id}`)
  if(punishment === null) punishment = dpunishment
if(punishment === 'roleremove') {
role.guild.members.cache.get(entry.id).roles.cache.map(userroles => {
role.guild.members.cache.get(entry.id).roles.remove(userroles.id)
db.delete(`executer_${role.guild.id}_${entry.id}_roledelete`)
console.log('trying to remove user roles..')
let logsembed = new Discord.MessageEmbed()
.setTitle(`${entry.tag} was trying to raid ! [Breaking Role Delete Limts]`)
.setColor(red)
return client.channels.cache.get(logs).send(logsembed);
})
}
if(punishment === 'ban') {
role.guild.members.cache.get(entry.id).ban()
db.delete(`executer_${role.guild.id}_${entry.id}_roledelete`)
console.log('trying to ban the user..')
let logsembed = new Discord.MessageEmbed()
.setTitle(`${entry.tag} was trying to raid ! [Breaking Role Delete Limts]`)
.setColor(red)
return client.channels.cache.get(logs).send(logsembed);
}
if(punishment === 'kick') {
role.guild.members.cache.get(entry.id).kick()
db.delete(`executer_${role.guild.id}_${entry.id}_roledelete`)
console.log('trying to kick the user..')
let logsembed = new Discord.MessageEmbed()
.setTitle(`${entry.tag} was trying to raid ! [Breaking Role Delete Limts]`)
.setColor(red)
return client.channels.cache.get(logs).send(logsembed);
}
return;
       }
       let warn = db.get(`executer_${role.guild.id}_${entry.id}_roledelete`)
       let logsembed = new Discord.MessageEmbed()

       .setTitle(`${entry.tag} Is Deleting Roles.. [${warn || 0}/${author || 0}]`)
       .setColor(cyan)
       client.channels.cache.get(logs).send(logsembed)
});        

client.on("channelCreate", async channel => {
    const user = await channel.guild.fetchAuditLogs({
        type: 'CHANNEL_CREATE'
    }).then(audit => audit.entries.first())
    const entry = user.executor 
    let trustedusers = db.get(`trustedusers_${channel.guild.id}`)
    if(trustedusers && trustedusers.find(find => find.user == entry.id)) {
    return console.log('Its Trusted User');
    }
    db.add(`executer_${channel.guild.id}_${entry.id}_channelcreate`, 1)
    let author = db.get(`executer_${channel.guild.id}_${entry.id}_channelcreate`)
  let limts = db.get(`channelcreatelimts_${channel.guild.id}`)
if(limts === null) {
    return console.log('shit');
}
let logs = db.get(`acitonslogs_${channel.guild.id}`)

if(author > limts) {
  let punishment = db.get(`punishment_${channel.guild.id}`)
  if(punishment === null) punishment = dpunishment
if(punishment === 'roleremove') {
channel.guild.members.cache.get(entry.id).roles.cache.map(userroles => {
channel.guild.members.cache.get(entry.id).roles.remove(userroles.id)
db.delete(`executer_${channel.guild.id}_${entry.id}_channelcreate`)
console.log('trying to remove user roles..')
let logsembed = new Discord.MessageEmbed()
.setColor(red)
.setTitle(`${entry.tag} was trying to raid ! [Breaking Channel Create Limts]`)
return client.channels.cache.get(logs).send(logsembed);
})
}
if(punishment === 'ban') {
channel.guild.members.cache.get(entry.id).ban()
db.delete(`executer_${channel.guild.id}_${entry.id}_channelcreate`)
console.log('trying to ban the user..')
let logsembed = new Discord.MessageEmbed()
.setColor(red)
.setTitle(`${entry.tag} was trying to raid ! [Breaking Channel Create Limts]`)
return client.channels.cache.get(logs).send(logsembed);
}
if(punishment === 'kick') {
channel.guild.members.cache.get(entry.id).kick()
db.delete(`executer_${channel.guild.id}_${entry.id}_channelcreate`)
console.log('trying to kick the user..')
let logsembed = new Discord.MessageEmbed()
.setColor(red)
.setTitle(`${entry.tag} was trying to raid ! [Breaking Channel Create Limts]`)
return client.channels.cache.get(logs).send(logsembed);
}
return;
       }
       let warn = db.get(`executer_${channel.guild.id}_${entry.id}_channelcreate`)
       let logsembed = new Discord.MessageEmbed()

       .setTitle(`${entry.tag} Is Creating channel.. [${warn || 0}/${author || 0}]`)
       .setColor(cyan)
       client.channels.cache.get(logs).send(logsembed)
});        

client.on("channelDelete", async channel => {
     const user = await channel.guild.fetchAuditLogs({
        type: 'CHANNEL_DELETE'
    }).then(audit => audit.entries.first())
    const entry = user.executor 
    let trustedusers = db.get(`trustedusers_${channel.guild.id}`)
    if(trustedusers && trustedusers.find(find => find.user == entry.id)) {
    return console.log('Its Trusted User');
    }
    db.add(`executer_${channel.guild.id}_${entry.id}_channeldelete`, 1)

    let author = db.get(`executer_${channel.guild.id}_${entry.id}_channeldelete`)
  let limts = db.get(`channeldeletelimts_${channel.guild.id}`)
if(limts === null) {
    return console.log('shit');
}

let logs = db.get(`acitonslogs_${channel.guild.id}`)
    if(author > limts) {
      let punishment = db.get(`punishment_${channel.guild.id}`)
      if(punishment === null) punishment = dpunishment
if(punishment === 'roleremove') {
channel.guild.members.cache.get(entry.id).roles.cache.map(userroles => {
channel.guild.members.cache.get(entry.id).roles.remove(userroles.id)
db.delete(`executer_${channel.guild.id}_${entry.id}_channeldelete`)
console.log('trying to remove user roles..')
let logsembed = new Discord.MessageEmbed()
.setColor(red)
.setTitle(`${entry.tag} was trying to raid ! [Breaking Channel Delete Limts]`)
return client.channels.cache.get(logs).send(logsembed);
})
}
if(punishment === 'ban') {
channel.guild.members.cache.get(entry.id).ban()
db.delete(`executer_${channel.guild.id}_${entry.id}_channeldelete`)
console.log('trying to ban the user..')
let logsembed = new Discord.MessageEmbed()
.setColor(red)
.setTitle(`${entry.tag} was trying to raid ! [Breaking Channel Delete Limts]`)
return client.channels.cache.get(logs).send(logsembed);
}
if(punishment === 'kick') {
channel.guild.members.cache.get(entry.id).kick()
db.delete(`executer_${channel.guild.id}_${entry.id}_channeldelete`)
console.log('trying to kick the user..')
let logsembed = new Discord.MessageEmbed()
.setColor(red)
.setTitle(`${entry.tag} was trying to raid ! [Breaking Channel Delete Limts]`)
return client.channels.cache.get(logs).send(logsembed);
}
return;
}
       let warn = db.get(`executer_${channel.guild.id}_${entry.id}_channeldelete`)
       let logsembed = new Discord.MessageEmbed()
       .setColor(cyan)
       .setTitle(`${entry.tag} Is Deleting channel.. [${warn || 0}/${author || 0}]`)
       client.channels.cache.get(logs).send(logsembed)
});    
client.on("guildMemberRemove", async member => {
    const entry1 = await member.guild
    .fetchAuditLogs()
    .then(audit => audit.entries.first());
  if (entry1.action === "MEMBER_KICK") {
    const entry2 = await member.guild
      .fetchAuditLogs({
        type: "MEMBER_KICK"
        })
        .then(audit => audit.entries.first());
        const entry = entry2.executor;
        let trustedusers = db.get(`trustedusers_${member.guild.id}`)
        if(trustedusers && trustedusers.find(find => find.user == entry.id)) {
        return console.log('Its Trusted User');
        }
        db.add(`executer_${member.guild.id}_${entry.id}_kicklimts`, 1)

        let author = db.get(`executer_${member.guild.id}_${entry.id}_kicklimts`)
        let limts = db.get(`kicklimts_${member.guild.id}`)
      if(limts === null) {
          return console.log('shit');
      }

      let logs = db.get(`acitonslogs_${member.guild.id}`)
          if(author > limts) {
            let punishment = db.get(`punishment_${member.guild.id}`)
            if(punishment === null) punishment = dpunishment
if(punishment === 'roleremove') {
member.guild.members.cache.get(entry.id).roles.cache.map(userroles => {
member.guild.members.cache.get(entry.id).roles.remove(userroles.id)
db.delete(`executer_${member.guild.id}_${entry.id}_kicklimts`)
console.log('trying to remove user roles..')
let logsembed = new Discord.MessageEmbed()
.setColor(red)
.setTitle(`${entry.tag} was trying to raid ! [Breaking Kick Members Limts]`)
return client.channels.cache.get(logs).send(logsembed);
})
}
if(punishment === 'ban') {
member.guild.members.cache.get(entry.id).ban()
db.delete(`executer_${member.guild.id}_${entry.id}_kicklimts`)
console.log('trying to ban the user..')
let logsembed = new Discord.MessageEmbed()
.setColor(red)
.setTitle(`${entry.tag} was trying to raid ! [Breaking Kick Members Limts]`)
return client.channels.cache.get(logs).send(logsembed);
}
if(punishment === 'kick') {
member.guild.members.cache.get(entry.id).kick()
db.delete(`executer_${member.guild.id}_${entry.id}_kicklimts`)
console.log('trying to kick the user..')
let logsembed = new Discord.MessageEmbed()
.setColor(red)
.setTitle(`${entry.tag} was trying to raid ! [Breaking Kick Members Limts]`)
return client.channels.cache.get(logs).send(logsembed);
}
 
return;
             }
             let warn = db.get(`executer_${member.guild.id}_${entry.id}_kicklimts`)
             let logsembed = new Discord.MessageEmbed()
             .setColor(cyan)
             .setTitle(`${entry.tag} Is Kicking Members.. [${warn || 0}/${author || 0}]`)
             client.channels.cache.get(logs).send(logsembed)
      
    }
    })
    client.on("guildMemberRemove", async member => {
        const entry1 = await member.guild
        .fetchAuditLogs()
        .then(audit => audit.entries.first());
      if (entry1.action === "MEMBER_BAN_ADD") {
        const entry2 = await member.guild
          .fetchAuditLogs({
            type: "MEMBER_BAN_ADD"
            })
            .then(audit => audit.entries.first());
            const entry = entry2.executor;
            let trustedusers = db.get(`trustedusers_${member.guild.id}`)
            if(trustedusers && trustedusers.find(find => find.user == entry.id)) {
            return console.log('Its Trusted User');
            }
            db.add(`executer_${member.guild.id}_${entry.id}_banlimts`, 1)

            let author = db.get(`executer_${member.guild.id}_${entry.id}_banlimts`)
            let limts = db.get(`banlimts_${member.guild.id}`)
          if(limts === null) {
              return console.log('shit');
          }

          let logs = db.get(`acitonslogs_${member.guild.id}`)
              if(author > limts) {
                let punishment = db.get(`punishment_${member.guild.id}`)
                if(punishment === null) punishment = dpunishment
if(punishment === 'roleremove') {
  member.guild.members.cache.get(entry.id).roles.cache.map(userroles => {
  member.guild.members.cache.get(entry.id).roles.remove(userroles.id)
   db.delete(`executer_${member.guild.id}_${entry.id}_banlimts`)
  console.log('trying to remove user roles..')
   let logsembed = new Discord.MessageEmbed()
   .setColor(red)
  .setTitle(`${entry.tag} was trying to raid ! [Breaking Banning Members Limts]`)
 return client.channels.cache.get(logs).send(logsembed);
  })
}
if(punishment === 'ban') {
  member.guild.members.cache.get(entry.id).ban()
  db.delete(`executer_${member.guild.id}_${entry.id}_banlimts`)
  console.log('trying to ban the user..')
   let logsembed = new Discord.MessageEmbed()
   .setColor(red)
  .setTitle(`${entry.tag} was trying to raid ! [Breaking Banning Members Limts]`)
 return client.channels.cache.get(logs).send(logsembed);
 }
 if(punishment === 'kick') {
  member.guild.members.cache.get(entry.id).kick()
  db.delete(`executer_${member.guild.id}_${entry.id}_banlimts`)
  console.log('trying to kick the user..')
   let logsembed = new Discord.MessageEmbed()
   .setColor(red)
  .setTitle(`${entry.tag} was trying to raid ! [Breaking Banning Members Limts]`)
 return client.channels.cache.get(logs).send(logsembed);
 }
 return;
              }
                 let warn = db.get(`executer_${member.guild.id}_${entry.id}_banlimts`)
                 let logsembed = new Discord.MessageEmbed()
                 .setColor(cyan)
                 .setTitle(`${entry.tag} Is Banning Members.. [${warn || 0}/${author || 0}]`)
                 client.channels.cache.get(logs).send(logsembed)
          
        }
        })
    
 
