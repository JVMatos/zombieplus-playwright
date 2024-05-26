const { test, expect } = require('../support')
const { faker } = require('@faker-js/faker')
const { executeSQL } = require('../support/database')

test.beforeAll(async ()=>{
    await executeSQL(`DELETE from leads`)
})

test('Deve cadastrar um lead na fila de espera', async ({ page }) => {
    const leadName = faker.person.fullName()
    const leadEmail = faker.internet.email()

    await page.leads.visit()
    await page.leads.openLeadModal()
    await page.leads.submitLeadForm(leadName, leadEmail)
    const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato.'
    await page.popup.haveText(message)
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

    await page.leads.visit()
    await page.leads.openLeadModal()
    await page.leads.submitLeadForm(leadName, leadEmail)
    const message = 'Verificamos que o endereço de e-mail fornecido já consta em nossa lista de espera. Isso significa que você está um passo mais perto de aproveitar nossos serviços.'
    await page.popup.haveText(message)
})

test('Não deve cadastrar com e-mail incorreto', async ({ page }) => {
    await page.leads.visit()
    await page.leads.openLeadModal()
    await page.leads.submitLeadForm('João Vitor Matos', 'joao.matos.com')

    await page.leads.alertHaveText('Email incorreto')
})

test('Não deve cadastrar com campo nome em branco', async ({ page }) => {
    await page.leads.visit()
    await page.leads.openLeadModal()
    await page.leads.submitLeadForm('', 'joao.matos@gmail.com')

    await page.leads.alertHaveText('Campo obrigatório')
})

test('Não deve cadastrar com campo e-mail em branco', async ({ page }) => {
    await page.leads.visit()
    await page.leads.openLeadModal()
    await page.leads.submitLeadForm('João Vitor Matos', '')

    await page.leads.alertHaveText('Campo obrigatório')
})

test('Não deve cadastrar com os dois campos em branco', async ({ page }) => {
    await page.leads.visit()
    await page.leads.openLeadModal()
    await page.leads.submitLeadForm('', '')

    await page.leads.alertHaveText(['Campo obrigatório', 'Campo obrigatório'])
})