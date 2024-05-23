const { test, expect } = require('../support')
const { faker } = require('@faker-js/faker')

test('Deve cadastrar um lead na fila de espera', async ({ page }) => {
    const leadName = faker.person.fullName()
    const leadEmail = faker.internet.email()

    await page.landing.visit()
    await page.landing.openLeadModal()
    await page.landing.submitLeadForm(leadName, leadEmail)
    const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!'
    await page.toast.containText(message)
})

test('Não deve cadastrar um e-mail já existente', async ({ page, request }) => {
    const leadName = faker.person.fullName()
    const leadEmail = faker.internet.email()

    const newLead = await request.post('http://localhost:3333/leads', {
        data: {
            name: leadName,
            email: leadEmail
        }
    })

    expect(newLead.ok()).toBeTruthy()

    await page.landing.visit()
    await page.landing.openLeadModal()
    await page.landing.submitLeadForm(leadName, leadEmail)
    const message = 'O endereço de e-mail fornecido já está registrado em nossa fila de espera.'
    await page.toast.containText(message)
})

test('Não deve cadastrar com e-mail incorreto', async ({ page }) => {
    await page.landing.visit()
    await page.landing.openLeadModal()
    await page.landing.submitLeadForm('João Vitor Matos', 'joao.matos.com')

    await page.landing.alertHaveText('Email incorreto')
})

test('Não deve cadastrar com campo nome em branco', async ({ page }) => {
    await page.landing.visit()
    await page.landing.openLeadModal()
    await page.landing.submitLeadForm('', 'joao.matos@gmail.com')

    await page.landing.alertHaveText('Campo obrigatório')
})

test('Não deve cadastrar com campo e-mail em branco', async ({ page }) => {
    await page.landing.visit()
    await page.landing.openLeadModal()
    await page.landing.submitLeadForm('João Vitor Matos', '')

    await page.landing.alertHaveText('Campo obrigatório')
})

test('Não deve cadastrar com os dois campos em branco', async ({ page }) => {
    await page.landing.visit()
    await page.landing.openLeadModal()
    await page.landing.submitLeadForm('', '')

    await page.landing.alertHaveText(['Campo obrigatório', 'Campo obrigatório'])
})