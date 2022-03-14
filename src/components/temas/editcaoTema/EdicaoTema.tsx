import React, { useState, useEffect, ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { Container, Typography, TextField, Button, RadioGroup, FormLabel, FormControl, FormControlLabel, Radio, InputLabel, MenuItem, FormHelperText, Select, DialogTitle, Dialog, DialogContent, DialogContentText, DialogActions } from "@material-ui/core"
import { useHistory, useParams } from 'react-router-dom'
import './EdicaoTema.css';
import Tema from '../../../models/Tema';
import Categoria from '../../../models/Categoria'
import { buscaId, post, put } from '../../../services/Service';
import { useSelector } from 'react-redux';
import { TokenState } from '../../../store/tokens/tokensReducer';
import { toast } from 'react-toastify';
import { orange } from '@material-ui/core/colors';
import isImageURL from 'image-url-validator';


function EdicaoTema() {
    let history = useHistory();
    const { id } = useParams<{ id: string }>();

    const [open, setOpen] = React.useState(false);

    const [openNoEdit, setOpenNoEdit] = React.useState(false);

    const [editStatus, setEditStatus] = React.useState(false);

    const handleClickSalvar = () => {

        if (editStatus === false) setOpenNoEdit(true);

    }

    const handleClickOpen = () => {

        if (editStatus === true) setOpen(true);

        // if (editStatus === false) setOpenNoEdit(true)

    };

    const handleClose = () => {
        setOpen(false);
    };

    const [evidencia, setEvidencia] = React.useState(false)

    const [imgURL, setimgURL] = React.useState<string>();
    const [errors, setErrors] = React.useState<{ imgURL: string }>();

    const handleChangeNivel = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
        updatedTema(event);
    };

    const handleChangeTipo = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTipoValue((event.target as HTMLInputElement).value);
        updatedTema(event);

        if ((event.target as HTMLInputElement).value === 'SAST') setEvidencia(prevEvidencia => true);

        if ((event.target as HTMLInputElement).value !== 'SAST') setEvidencia(prevEvidencia => false);

    }

    const handleChangeEvidence = (event: React.ChangeEvent<HTMLInputElement>) => {

        const {
            target: { value },
        } = event;
        setErrors({ imgURL: "" });
        setimgURL(value);
        let reg = new RegExp(/\.(jpg|jpeg|png)$/).test(value);
        if (!reg) {
            setErrors({ imgURL: "Permitido apenas URL de imagem JPG, JPEG e PNG" });
        }

        setTipoValue((event.target as HTMLInputElement).value);
        updatedTema(event);
    };


    const token = useSelector<TokenState, TokenState["tokens"]>(
        (state) => state.tokens
    );
    const [tema, setTema] = useState<Categoria>({
        id: 0,
        categoria: '',
        descricaoCategoria: '',
        nivel: '',
        tipo: '',
        evidencia: '',
        solucao: ''
    })

    useEffect(() => {
        if (token === "") {
            toast.error('Você precisa estar logado', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                theme: "colored",
                progress: undefined,
            });
            history.push("/login")

        }
    }, [token])

    useEffect(() => {
        if (id !== undefined) {
            findById(id)
        }
    }, [id])

    async function findById(id: string) {
        buscaId(`/posts/${id}`, setTema, {
            headers: {
                'Authorization': token
            }
        })
    }

    function updatedTema(e: ChangeEvent<HTMLInputElement>) {

        setTema({
            ...tema,
            [e.target.name]: e.target.value,
        })
    }

    async function onSubmit(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault()
        console.log("tema " + JSON.stringify(tema))

        if ((id !== undefined) && (openNoEdit === false)) {
            console.log(tema)
            put(`/posts`, tema, setTema, {
                headers: {
                    'Authorization': token
                }
            })
            toast.success('Vulnerabilidade atualizada com sucesso', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                theme: "colored",
                progress: undefined,
            });
        } else {
            post(`/posts`, tema, setTema, {
                headers: {
                    'Authorization': token
                }
            })
            toast.success('Nenhum dado alterado', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                theme: "colored",
                progress: undefined,
            });
        }
        back()

    }

    function back() {
        history.push('/temas')
    }

    const [value, setValue] = React.useState(tema.nivel);

    const [tipoValue, setTipoValue] = React.useState(tema.tipo);

    const [categoriaField, setCategoriaField] = React.useState('');
    const [descricaoField, setDescricaoField] = React.useState(tema.descricaoCategoria);
    const [nivelField, setNivelField] = React.useState(tema.nivel);
    const [tipoField, setTipoField] = React.useState(tema.tipo);
    const [solucaoField, setSolucaoField] = React.useState(tema.solucao);



    useEffect(() => {
        if (categoriaField === '') {
            setCategoriaField(prevCategoriaField => tema.categoria)
        } else if (categoriaField !== tema.categoria) {
            setEditStatus(prevEditStatus => true);
        }

        if (descricaoField === '') {
            setDescricaoField(prevDescricaoField => tema.descricaoCategoria)
        } else if (descricaoField !== tema.descricaoCategoria) {
            setEditStatus(prevEditStatus => true);
        }

        if (tipoField === '') {
            setTipoField(prevTipoFiel => tema.tipo)
        } else if (tipoField !== tema.tipo) {
            setEditStatus(prevEditStatus => true);
        }

        if (nivelField === '') {
            setNivelField(prevNivelField => tema.nivel)
        } else if (nivelField !== tema.nivel) {
            setEditStatus(prevEditStatus => true);
        }

        if (solucaoField === '') {
            setSolucaoField(prevSolucaoField => tema.solucao)
        } else if (solucaoField !== tema.solucao) {
            setEditStatus(prevEditStatus => true);
        }


    }, [tema.categoria, categoriaField, tema.descricaoCategoria, descricaoField, tema.tipo, tipoField, tema.nivel, nivelField, tema.solucao, solucaoField])

    return (
        <Container maxWidth="lg" className="topo">
            <form onSubmit={onSubmit}>
                <Typography variant="h3" color="textSecondary" component="h3" align="center" >Edição de cadastro</Typography>
                <TextField
                    value={tema.categoria}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updatedTema(e)}
                    id="categoria"
                    label="título vulnerabilidade"
                    variant="outlined"
                    name="categoria"
                    margin="normal"
                    required
                    fullWidth
                />
                <TextField
                    value={tema.descricaoCategoria}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updatedTema(e)}
                    id="descricaoCategoria"
                    label="descrição da vulnerabilidade"
                    variant="outlined"
                    name="descricaoCategoria"
                    margin="normal"
                    required
                    fullWidth
                />

                {/* <TextField
                    value={tema.nivel}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updatedTema(e)}
                    id="nivel" label="nivel"
                    variant="outlined"
                    name="nivel"
                    margin="normal"
                    fullWidth
                /> */}
                <FormControl>
                    <FormLabel id="demo-controlled-radio-buttons-group">grau de criticidade</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="nivel"
                        value={value}
                        onChange={handleChangeNivel}
                        row
                        aria-required
                    >

                        <FormControlLabel value='low' control={<Radio />} className='radioColor' label="low" />
                        <FormControlLabel value='min' control={<Radio />} className='radioColor' label="min" />
                        <FormControlLabel value='high' control={<Radio />} className='radioColor' label="high" />

                    </RadioGroup>
                </FormControl>

                <FormControl>
                    <FormLabel id="demo-controlled-radio-buttons-group">tipo</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="tipo"
                        value={tipoValue}
                        onChange={handleChangeTipo}
                        row
                        aria-required
                    >

                        <FormControlLabel value='DAST' control={<Radio />} className='radioColor' label="DAST" />
                        <FormControlLabel value='SAST' control={<Radio />} className='radioColor' label="SAST" />
                        <FormControlLabel value='NETWORK' control={<Radio />} className='radioColor' label="NETWORK" />

                    </RadioGroup>
                </FormControl>

                <TextField
                    value={imgURL}
                    onChange={handleChangeEvidence}
                    id="evidencia"
                    label="evidência da vulnerabilidade (URL imagem)"
                    error={Boolean(errors?.imgURL)}
                    helperText={errors?.imgURL}
                    variant="outlined"
                    name="evidencia"
                    margin="normal"
                    required={evidencia}
                    fullWidth
                />


                <TextField
                    value={tema.solucao}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updatedTema(e)}
                    id="solucao"
                    label="proposta de solução"
                    variant="outlined"
                    name="solucao"
                    margin="normal"
                    multiline={true}
                    minRows={10}
                    required
                    fullWidth
                />

                <Typography
                    variant='subtitle2'
                    color='textSecondary'
                    align='right'>
                    * Campos obrigatórios
                </Typography>

                <Button
                    onClick={handleClickOpen}
                    variant="contained"
                    color="secondary"
                >
                    Voltar
                </Button>

                <Button
                    onClick={handleClickSalvar}
                    type="submit"
                    variant="contained"
                    color="primary"
                >
                    Salvar
                </Button>

                <Dialog
                    open={openNoEdit}
                >
                    <DialogContent>
                        Nenhum dado foi alterado
                    </DialogContent>
                    <DialogActions>
                        <Link to={`/home`} className="text-decorator-none">
                            <Button onClick={handleClose}>
                                Proceder
                            </Button>
                        </Link>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={open}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Tem certeza?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Você está saíndo do cadastro sem salvar os dados. Deseja continuar?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>
                            Não
                        </Button>
                        <Link to={`/home`} className="text-decorator-none">
                            <Button onClick={handleClose}>
                                Sim
                            </Button>
                        </Link>
                    </DialogActions>
                </Dialog>
            </form>
        </Container>
    )
}

export default EdicaoTema;