import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const LoginPage = () => {
    let {loginUser} = useContext(AuthContext)
    return (
        <div className="container-lg h-100">
            <div className="row vh-100 justify-content-center align-items-center">
                <div className="col-12 col-md-10 col-lg-6 col-xl-5">
                    <div className="card bg-dark text-white rounded-5 h-100" sx={{borderRadius: "5rem"}}>
                        <div className="card-body text-center">

                            <form className="mb-3" onSubmit={loginUser}>
                                <h2 className="fw-bold mb-5 ff">Авторизация</h2>

                                <div className="form-outline form-white mb-4">
                                    <input type="text" placeholder="Введите логин" id="username"
                                           className="form-control form-control-lg"/>
                                </div>

                                <div className="form-outline form-white">
                                    <input type="password" id="password" placeholder="Введите пароль"
                                           className="form-control form-control-lg"/>
                                </div>

                                <p className="small mb-3"><a className="text-white-50"> </a></p>

                                <button className="btn btn-outline-light btn-lg px-5" type="submit">Войти</button>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage