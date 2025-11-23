#!/usr/bin/env node

/**
 * Script para atualizar o hash do commit no arquivo buildInfo.js
 * 
 * Uso:
 *   node scripts/update-commit-hash.js
 *   ou
 *   npm run update:commit
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BUILD_INFO_PATH = path.join(__dirname, '..', 'utils', 'buildInfo.js');

try {
  // Obter o hash do commit atual
  const commitHash = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
  
  // Ler o arquivo buildInfo.js
  let buildInfoContent = fs.readFileSync(BUILD_INFO_PATH, 'utf-8');
  
  // Substituir o hash do commit
  const hashRegex = /export const COMMIT_HASH = '([^']+)';/;
  if (hashRegex.test(buildInfoContent)) {
    buildInfoContent = buildInfoContent.replace(
      hashRegex,
      `export const COMMIT_HASH = '${commitHash}';`
    );
    
    // Salvar o arquivo atualizado
    fs.writeFileSync(BUILD_INFO_PATH, buildInfoContent, 'utf-8');
    
    console.log('✅ Hash do commit atualizado com sucesso!');
    console.log(`📝 Novo hash: ${commitHash}`);
  } else {
    console.error('❌ Erro: Não foi possível encontrar COMMIT_HASH no arquivo buildInfo.js');
    process.exit(1);
  }
} catch (error) {
  if (error.message.includes('not a git repository')) {
    console.error('❌ Erro: Este diretório não é um repositório Git');
    console.log('💡 Dica: Execute este script dentro do diretório do projeto Git');
  } else if (error.message.includes('git rev-parse')) {
    console.error('❌ Erro: Não foi possível obter o hash do commit');
    console.log('💡 Dica: Certifique-se de que o Git está instalado e configurado');
  } else {
    console.error('❌ Erro ao atualizar hash do commit:', error.message);
  }
  process.exit(1);
}

