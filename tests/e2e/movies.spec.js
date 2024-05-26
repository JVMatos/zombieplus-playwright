const { test, expect } = require('../support')

const data = require('../support/fixtures/movies.json')
const { executeSQL } = require('../support/database')
const { request } = require('http')

test('Deve cadastrar um novo filme', async ({ page }) => {
    const movie = data.create
    await executeSQL(`DELETE from movies WHERE title = '${movie.title}'`)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.movies.create(movie)
    await page.popup.haveText(`O filme '${movie.title}' foi adicionado ao catálogo.`)
})

test('Deve excluir um filme', async ({ page, request }) => {
    const movie = data.to_remove
    await executeSQL(`DELETE from movies WHERE title = '${movie.title}'`)
    await request.api.postMovie(movie)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.movies.remove(movie.title)
    await page.popup.haveText('Filme removido com sucesso.')
})

test('Não deve cadastrar filmes com títulos duplicados', async ({ page, request }) => {
    const movie = data.duplicate
    await executeSQL(`DELETE from movies WHERE title = '${movie.title}'`)
    await request.api.postMovie(movie)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.movies.create(movie)
    await page.popup.haveText(`O título '${movie.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`)
})

test('Não deve cadastrar com campos obrigatórios em branco', async ({ page }) => {
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.movies.goForm()
    await page.movies.submit()

    await page.movies.alertHaveText([
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório'
    ])
})

test('Deve realizar busca pelo termo zumbi', async ({ page, request }) => {
    const movies = data.search
    movies.data.forEach(async (m) => {
        await executeSQL(`DELETE from movies WHERE title = '${m.title}'`)
        await request.api.postMovie(m)
    })

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.movies.search(movies.input)
    await page.movies.tableHave(movies.outputs)
})