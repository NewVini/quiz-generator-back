import ormconfig from '../ormconfig';

async function main() {
  const ds = await ormconfig.initialize();
  await ds.synchronize();
  await ds.destroy();
  console.log('Sincronização concluída!');
}

main(); 