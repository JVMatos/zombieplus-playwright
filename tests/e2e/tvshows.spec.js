//@ts-check
const { test } = require('../support')

const data = require('../support/fixtures/tvshows.json')
const { executeSQL } = require('../support/database')

test('Deve cadastrar uma nova série', async ({ page }) => {
    const tvshow = data.create
    await executeSQL(`DELETE from tvshows WHERE title = '${tvshow.title}'`)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.create(tvshow)
    await page.popup.haveText(`A série '${tvshow.title}' foi adicionada ao catálogo.`)
})

test('Deve excluir uma série', async ({ page, request }) => {
    const tvshow = data.to_remove
    await executeSQL(`DELETE from tvshows WHERE title = '${tvshow.title}'`)
    await request.api.postTvShow(tvshow)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.remove(tvshow.title)
    await page.popup.haveText('Série removida com sucesso.')
})

test('Não deve cadastrar séries com títulos duplicados', async ({ page, request }) => {
    const tvshow = data.duplicate
    await executeSQL(`DELETE from tvshows WHERE title = '${tvshow.title}'`)
    await request.api.postTvShow(tvshow)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.create(tvshow)
    await page.popup.haveText(`O título '${tvshow.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`)
})

test('Não deve cadastrar com campos obrigatórios em branco', async ({ page }) => {
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.goForm()
    await page.tvshows.submit()

    await page.tvshows.alertHaveText([
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        "Campo obrigatório (apenas números)"
    ])
})

test('Deve realizar busca pelo termo zombie', async ({ page, request }) => {
    const tvshows = data.search
    tvshows.data.forEach(async (t) => {
        await executeSQL(`DELETE from tvshows WHERE title = '${t.title}'`)
        await request.api.postTvShow(t)
    })

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.search(tvshows.input)
    await page.tvshows.tableHave(tvshows.outputs)
})