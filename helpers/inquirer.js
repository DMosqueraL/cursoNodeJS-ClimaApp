import colors from 'colors';

import inquirer from 'inquirer';

const menuOpts = [
  {
    type: 'list',
    name: 'option',
    message: '¿Qué desea hacer?',
    choices: [
      {
        value: 1,
        name: `${'1.'.brightYellow} Buscar Lugar`,
      },
      {
        value: 2,
        name: `${'2.'.brightYellow} Historial Lugares`,
      },
      {
        value: 0,
        name: `${'0.'.brightYellow} Salir`,
      }
    ],
  },
];

const entrada = [
  {
    type: 'input',
    name: 'pausa',
    message: `Presione ${'ENTER'.brightYellow} para continuar`,
  },
];

const inquirerMenu = async () => {
  console.clear();

  console.log('=============================='.brightYellow);
  console.log('    Seleccione una opción'.white);
  console.log('==============================\n'.brightYellow);

  const { option } = await inquirer.prompt(menuOpts);

  return option;
};

const pausa = async () => {
  console.log('\n');
  await inquirer.prompt(entrada);
};

const leerInput = async (message) => {
  const question = [
    {
      type: 'input',
      name: 'Lugar',
      message,
      validate(value) {
        if (value.length === 0) {
          return 'Por favor ingrese un lugar a buscar';
        }
        return true;
      },
    },
  ];

  const { Lugar } = await inquirer.prompt(question);
  return Lugar;
};

const listarLugares = async (lugares = []) => {
  const choices = lugares.map((lugar, i) => {
    const indice = `${i + 1}.`.brightMagenta;

    return {
      value: lugar.id,
      name: `${indice} ${lugar.nombre}`,
    };
  });

  choices.unshift({
    value: '0',
    name: '0.'.brightMagenta + 'Cancelar'
  })

  const preguntas = [
    {
      type: 'list',
      name: 'id',
      message: 'Seleccione lugar: ',
      choices,
    },
  ];

  const { id } = await inquirer.prompt(preguntas);
  return id;
};

export { inquirerMenu, pausa, leerInput, listarLugares, confirmar, mostrarListadoCheckList };
