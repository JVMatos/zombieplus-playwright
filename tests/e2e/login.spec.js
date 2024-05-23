const { test } = require('../support')

test('Deve logar como administrador', async ({ page }) => {
    await page.login.visit()
    await page.login.submit('admin@zombieplus.com', 'pwd123')
    await page.movies.isLoggedIn()
})

test('Não deve logar com senha incorreta', async ({ page }) => {
    await page.login.visit()
    await page.login.submit('admin@zombieplus.com', 'abc456')
    const message = 'Oops!Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente.'
    await page.toast.containText(message)
})

test('Não deve logar com email inválido', async ({ page }) => {
    await page.login.visit()
    await page.login.submit('www.matos.com.br', 'abc456')
    await page.login.alertHaveText('Email incorreto')
})

test('Não deve logar com email em branco', async ({ page }) => {
    await page.login.visit()
    await page.login.submit('', 'abc456')
    await page.login.alertHaveText('Campo obrigatório')
})

test('Não deve logar com senha em branco', async ({ page }) => {
    await page.login.visit()
    await page.login.submit('admin@zombieplus.com', '')
    await page.login.alertHaveText('Campo obrigatório')
})

test('Não deve logar com email e senha em branco', async ({ page }) => {
    await page.login.visit()
    await page.login.submit('', '')
    await page.login.alertHaveText(['Campo obrigatório', 'Campo obrigatório'])
})

