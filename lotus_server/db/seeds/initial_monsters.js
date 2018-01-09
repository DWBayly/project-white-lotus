const uuidv4 = require('uuid/v4');

function getNewUUID() {
  return uuidv4();
}

exports.seed = function(knex, Promise) {

  const user = 1;
  const bodies = Array(6).fill().map(() => uuidv4());
  const heads = Array(12).fill().map(() => uuidv4());
  const arms = Array(9).fill().map(() => uuidv4());
  const attacks = Array(15).fill().map(() => uuidv4());
  const abilities = Array(6).fill().map(() => uuidv4());
  const types = [1, 2, 3];

  // Deletes ALL existing entries
  return Promise.all([
    knex('monsters').del(),
    knex('teams_monsters').del(),
    knex('teams').del(),
    knex('bodies').del(),
    knex('heads').del(),
    knex('arms').del(),
    knex('types').del(),
    knex('abilities').del(),
    knex('attacks').del()
  ]).then(function () {
    // Inserts seed entries
    return Promise.all([
      knex('monsters').insert([
        {
          id: 1,
          name: 'Blob',
          user_id: user,
          body_id: bodies[0],
          arm_id: arms[0],
          head_id: heads[0],
          image: '/assets/monsters/BLOB.png'
        },
        {
          id: 2,
          name: 'T-Wrex',
          user_id: user,
          body_id: bodies[1],
          arm_id: arms[1],
          head_id: heads[1],
          image:'/assets/monsters/T-Wrex.png'

        },
        {
          id: 3,
          name: 'C\'thulumonster',
          user_id: user,
          body_id: bodies[2],
          arm_id: arms[2],
          head_id: heads[2],
          image:'/assets/monsters/cthulamonster.png'
        },
        {
          id: 4,
          name: 'Shock Top',
          user_id: user,
          body_id: bodies[3],
          arm_id: arms[3],
          head_id: heads[3],
          image:'/assets/monsters/Shocktop.png'

        },
        {
          id: 5,
          name: 'Medi-o-cre',
          user_id: user,
          body_id: bodies[4],
          arm_id: arms[4],
          head_id: heads[4],
          image: '/assets/monsters/mediocre.png'
        },
        {
          id: 6,
          name: 'Red Knight',
          user_id: user,
          body_id: bodies[5],
          arm_id: arms[5],
          head_id: heads[5],
          image: '/assets/monsters/RK.png'
        },
      ]),
      knex('bodies').insert([
        {
          id: bodies[0],
          name: 'Blob',
          image_url:'./models/parts/BLOBB.png',
          hp: 3000,
          accuracy_bonus: 0,
          type_id: types[0],
          creature: 'kaiju',
          nameword: 'Blob'
        },
        {
          id: bodies[1],
          name: 'T-Wrex',
          image_url:'./models/parts/TWB.png',
          hp: 3500,
          accuracy_bonus: -1,
          type_id: types[1],
          creature: 'kaiju',
          nameword: 'Dino'
        },
        {
          id: bodies[2],
          name: 'C\'thulumonster',
          image_url:'./models/parts/CMB.png',
          hp: 2500,
          type_id: types[2],
          accuracy_bonus: +1,
          creature: 'kaiju',
          nameword: 'Horror'

        },
        {
          id: bodies[3],
          name: 'Shock Top',
          image_url:'./models/parts/STB.png',
          hp: 2500,
          accuracy_bonus: +1,
          type_id: types[2],
          creature: 'mecha',
          nameword: 'Robot'
        },
        {
          id: bodies[4],
          name: 'Medi-o-cre',
          image_url:'./models/parts/MDB.png',
          hp: 2000,
          type_id: types[0],
          accuracy_bonus: +1,
          creature: 'mecha',
          nameword:'Medic'
        },
        {
          id: bodies[5],
          name: 'Red Knight',
          image_url:'./models/parts/RKB.png',
          hp: 2500,
          type_id: types[1],
          accuracy_bonus: +2,
          creature: 'mecha',
          nameword:'Knight'
        }
      ]),
      knex('heads').insert([
        {
          id: heads[0],
          name: 'Blob Maw',
          image_url: './models/parts/BLOBH.png',
          attack_id: attacks[0],
          ability_id: null,
          creature: 'kaiju',
          nameword:'Inexorable'
        },
        {
          id: heads[1],
          name: 'T-Wrex Head',
          image_url: './models/parts/TWH.png',
          attack_id: attacks[1],
          ability_id: null,
          creature: 'kaiju',
          nameword: 'Chomping'
        },
        {
          id: heads[2],
          name: 'C\'thulu Head',
          image_url: './models/parts/CMH.png',
          attack_id: attacks[2],
          ability_id: null,
          creature: 'kaiju',
          nameword: 'Mesmerizing'
        },
        {
          id: heads[3],
          name: 'Shock Top Helm',
          image_url: './models/parts/STH.png',
          attack_id: null,
          ability_id: abilities[0],
          creature: 'mecha',
          nameword: 'Shocking'
        },
        {
          id: heads[4],
          name: 'Medipad',
          image_url: './models/parts/MDH.png',
          attack_id: null,
          ability_id: abilities[1],
          creature: 'mecha',
          nameword: 'Altrusistic'
        },
        {
          id: heads[5],
          name: 'Red Knight Helm',
          image_url: './models/parts/RKH.png',
          attack_id: null,
          ability_id: abilities[2],
          creature: 'mecha',
          nameword: 'Red'
        },
        {
          id: heads[6],
          name: 'Hydra Heads',
          image_url: './models/parts/HH.png',
          attack_id: attacks[3],
          ability_id: null,
          creature: 'kaiju',
          nameword:'Serpentine'
        },
        {
          id: heads[7],
          name: 'Spider Head',
          image_url: './models/parts/SH.png',
          attack_id: attacks[4],
          ability_id: null,
          creature: 'kaiju',
          nameword:'Eight-eyed'
        },
        {
          id: heads[8],
          name: 'Eye of the Void',
          image_url: './models/parts/EVH.png',
          attack_id: attacks[5],
          ability_id: null,
          creature: 'kaiju',
          nameword: 'Unblinking'

        },
        {
          id: heads[9],
          name: 'Cyclone Laser System',
          image_url: './models/parts/CLSH.png',
          attack_id: null,
          ability_id: abilities[3],
          creature: 'mecha',
          nameword: 'Cyclone'
        },
        {
          id: heads[10],
          name: 'Hypermatter Generator',
          image_url: './models/parts/HMG.png',
          attack_id: null,
          ability_id: abilities[4],
          creature: 'mecha',
          nameword:'Hypermatter'
        },
        {
          id: heads[11],
          name: 'Missile Support Platform',
          image_url: './models/parts/MSPH.png',
          attack_id: null,
          ability_id: abilities[5],
          creature: 'mecha',
          nameword: 'Missile'
        }
      ]),
      knex('arms').insert([
        {
          id: arms[0],
          name: 'Blob',
          image_url: 'BLOB',
          attack_id: attacks[6],
          creature: 'kaiju',
          nameword: 'Slimey'
        },
        {
          id: arms[1],
          name: 'Stubby Wrex Arms',
          image_url: 'TW',
          attack_id: attacks[7],
          creature: 'kaiju',
          nameword:'Stubby-armed'
        },
        {
          id: arms[2],
          name: 'C\'thulumonster',
          image_url: 'CM',
          attack_id: attacks[8],
          creature: 'kaiju',
          nameword: 'Eldritch'
        },
        {
          id: arms[3],
          name: 'Shock Top',
          image_url: 'ST',
          attack_id: attacks[9],
          creature: 'mecha',
          nameword: 'Electro'
        },
        {
          id: arms[4],
          name: 'Medi-o-cre',
          image_url: 'MD',
          attack_id: attacks[10],
          creature: 'mecha',
          nameword: 'Support'
        },
        {
          id: arms[5],
          name: 'Red Knight',
          image_url: 'RK',
          attack_id: attacks[11],
          creature: 'mecha',
          nameword: 'Defender'
        },
        {
          id: arms[6],
          name: 'Mind Siphon',
          image_url: 'MS',
          attack_id: attacks[12],
          creature: 'kaiju',
          nameword: 'Mind-warping'
        },
        {
          id: arms[7],
          name: 'Snake Hands',
          image_url: 'SH',
          attack_id: attacks[13],
          creature: 'kaiju',
          nameword: 'Striking'
        },
        {
          id: arms[8],
          name: 'Spider Fang',
          image_url: 'SF',
          attack_id: attacks[14],
          creature: 'kaiju',
          nameword:'Biting'
        }
      ]),
      knex('attacks').insert([
        {
          id: attacks[0],
          name: 'toxic_slime',
          aoe: false,
          dot: true,
          description: 'Deal 4 damage per turn for 3 turns.'
        },
        {
          id: attacks[1],
          name: 'roar',
          aoe: true,
          dot: false,
          description: 'Deal 3 damage to each enemy.'
        },
        {
          id: attacks[2],
          name: 'insanity',
          aoe: false,
          dot: false,
          description: 'Deal 6 damage. Reduce the target\'s accuracy by 1 per turn until target is benched. '
        },
        {
          id: attacks[3],
          name: 'decimate',
          aoe: false,
          dot: false,
          description: 'Deal floor(target\'s max HP / target\'s current HP) damage.'
        },
        {
          id: attacks[4],
          name: 'web_sling',
          aoe: false,
          dot: false,
          description: 'Deal 5 damage. Next attack gets +2 accuracy, and target can\'t leave field.'
        },
        {
          id: attacks[5],
          name: 'deep_knowledge',
          aoe: false,
          dot: false,
          description: 'Take the type of the opposing player\'s active monster.'
        },
        {
          id: attacks[6],
          name: 'vomitous_sludge',
          aoe: false,
          dot: true,
          description: 'Deal 10 damage. Deal 1 damage per turn until target is benched.'
        },
        {
          id: attacks[7],
          name: 'steel_jaw',
          aoe: false,
          dot: false,
          description: 'Deal 14-18 damage.'
        },
        {
          id: attacks[8],
          name: 'eldritch_horror',
          aoe: false,
          dot: false,
          description: 'Deal 5-8 damage. Swap target with a random benched monster.'
        },
        {
          id: attacks[9],
          name: 'neutralize',
          aoe: false,
          dot: false,
          description: 'Deal 10-12 damage. Ignore an enemy passive until they are activated.'
        },
        {
          id: attacks[10],
          name: 'stimulant',
          aoe: false,
          dot: false,
          description: 'Deal 8 damage. Heal self for 4 HP.'
        },
        {
          id: attacks[11],
          name: 'hyper_lance',
          aoe: false,
          dot: false,
          description: 'Deal 8-12 damage.'
        },
        {
          id: attacks[12],
          name: 'simulate_kaiju',
          aoe: false,
          dot: false,
          description: 'Deal 10-12 damage. If enemy is a kaiju, gain its secondary attack.'
        },
        {
          id: attacks[13],
          name: 'snake_handler',
          aoe: false,
          dot: false,
          description: 'Deal 12-16 damage.'
        },
        {
          id: attacks[14],
          name: 'neurotoxin',
          aoe: false,
          dot: false,
          description: 'Deal 5-18 damage.'
        }
      ]),
      knex('abilities').insert([
        {
          id: abilities[0],
          name: 'supercharge',
          description: 'Active monster\'s attacks affect all enemy monsters.'
        },
        {
          id: abilities[1],
          name: 'nanomachine_swarm',
          description: 'Heal all mechas on your team by 2 HP per turn.'
        },
        {
          id: abilities[2],
          name: 'electric_shield',
          description: 'Take the first 5 damage the active monster would take.'
        },
        {
          id: abilities[3],
          name: 'pierce',
          description: 'Active monster\'s attack type becomes Pierce.'
        },
        {
          id: abilities[4],
          name: 'crush',
          description: 'Active monster\'s attack type becomes Crush.'
        },
        {
          id: abilities[5],
          name: 'spray',
          description: 'Active monster\'s attack type becomes Spray.'
        }
      ]),
      knex('types').insert([
        {
          id: types[0],
          name: 'pierce',
          weakness: types[1],
        },
        {
          id: types[1],
          name: 'crush',
          weakness: types[2],
        },
        {
          id: types[2],
          name: 'spray',
          weakness: types[0],
        }
      ]),
    ]);
  });
};
