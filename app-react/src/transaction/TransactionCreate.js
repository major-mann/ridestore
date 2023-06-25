module.exports = { TransactionCreate };

const Yup = require(`yup`);
const { useFormik } = require(`formik`);
const { InputText } = require(`primereact/inputtext`);
const { Button } = require(`primereact/button`);

function TransactionCreate() {
    const form = useFormik({
        initialValues: {
            accountId: ``,
            amount: 0,
        },
        validationSchema: Yup.object({
            accountId: Yup.string().required(`Account ID is required`),
            amount: Yup.integer()
                .required(`Amount MUST be a valid integer`)
                .test({
                    test: (value) => parseInt(value) !== 0,
                    message: `Amount may not be 0`
                }),
        })
    })

    return <div>
        <h1>Submit new transaction</h1>
        <form onSubmit={form.handleSubmit}>
            <label>
                Account ID
                <InputText data-type='account-id' name='accountId' value={form.values.accountId} />
                { error(`accountId`) }
            </label>
            <label>
                Amount
                <InputText data-type='amount' name='amount' value={form.values.amount} />
                { error(`amount`) }
            </label>
            {/* TODO: Check that is is OK to swap the input for a button */}
            <Button data-type='transaction-submit' label='Submit' type='submit' />
        </form>
    </div>;

    function error(name) {
        if (!form.touched[name]) {
            return null;
        }
        return <div className='error'>{form.errors[name]}</div>;
    }
}
