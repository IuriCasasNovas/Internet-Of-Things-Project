SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS Turno_Auxiliar;
DROP TABLE IF EXISTS Validacao;
DROP TABLE IF EXISTS Senha;
DROP TABLE IF EXISTS Compra;
DROP TABLE IF EXISTS Cartao;
DROP TABLE IF EXISTS Auxiliar;
DROP TABLE IF EXISTS Aluno;
DROP TABLE IF EXISTS Administrador;
DROP TABLE IF EXISTS Turno;
DROP TABLE IF EXISTS Estado;
DROP TABLE IF EXISTS Pessoa;

CREATE TABLE Pessoa (
    Id_Pessoa INT AUTO_INCREMENT PRIMARY KEY,
    Nome_Pessoa VARCHAR(255) NOT NULL,
    Email_Pessoa VARCHAR(255) NOT NULL,
    Palavra_Passe_Pessoa VARCHAR(255) NOT NULL,
    Telefone_Pessoa VARCHAR(20),
    Data_Nascimento_Pessoa DATE,
    Foto_Pessoa VARCHAR(255),
    UNIQUE (Email_Pessoa)
);

CREATE TABLE Estado (
    Id_Estado INT AUTO_INCREMENT PRIMARY KEY,
    Estado VARCHAR(50) NOT NULL,
    UNIQUE (Estado)
);

CREATE TABLE Turno (
    Id_Turno INT AUTO_INCREMENT PRIMARY KEY,
    Turno VARCHAR(50) NOT NULL,
    UNIQUE (Turno)
);

CREATE TABLE Administrador (
    Id_Administrador INT AUTO_INCREMENT PRIMARY KEY,
    Pessoa INT NOT NULL UNIQUE,
    Data_Login_Administrador DATETIME
);

ALTER TABLE Administrador
ADD CONSTRAINT fk_administrador_pessoa
FOREIGN KEY (Pessoa) REFERENCES Pessoa(Id_Pessoa);

CREATE TABLE Aluno (
    Id_Aluno INT AUTO_INCREMENT PRIMARY KEY,
    Pessoa INT NOT NULL UNIQUE,
    Estado INT NOT NULL,
    Curso_Aluno VARCHAR(255),
    Numero_Aluno VARCHAR(50) NOT NULL,
    UNIQUE (Numero_Aluno)
);

ALTER TABLE Aluno
ADD CONSTRAINT fk_aluno_pessoa
FOREIGN KEY (Pessoa) REFERENCES Pessoa(Id_Pessoa);

ALTER TABLE Aluno
ADD CONSTRAINT fk_aluno_estado
FOREIGN KEY (Estado) REFERENCES Estado(Id_Estado);

CREATE TABLE Auxiliar (
    Id_Auxiliar INT AUTO_INCREMENT PRIMARY KEY,
    Pessoa INT NOT NULL UNIQUE,
    Turno INT NOT NULL,
    Data_Contratacao_Auxiliar DATE
);

ALTER TABLE Auxiliar
ADD CONSTRAINT fk_auxiliar_pessoa
FOREIGN KEY (Pessoa) REFERENCES Pessoa(Id_Pessoa);

ALTER TABLE Auxiliar
ADD CONSTRAINT fk_auxiliar_turno
FOREIGN KEY (Turno) REFERENCES Turno(Id_Turno);

CREATE TABLE Cartao (
    Id_Cartao INT AUTO_INCREMENT PRIMARY KEY,
    Aluno INT NOT NULL,
    Estado INT NOT NULL
);

ALTER TABLE Cartao
ADD CONSTRAINT fk_cartao_aluno
FOREIGN KEY (Aluno) REFERENCES Aluno(Id_Aluno);

ALTER TABLE Cartao
ADD CONSTRAINT fk_cartao_estado
FOREIGN KEY (Estado) REFERENCES Estado(Id_Estado);

CREATE TABLE Compra (
    Id_Compra INT AUTO_INCREMENT PRIMARY KEY,
    Aluno INT NOT NULL,
    Data_Hora_Compra DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Valor_Total_Compra DECIMAL(10,2) NOT NULL,
    Metodo_Pagamento_Compra VARCHAR(50)
);

ALTER TABLE Compra
ADD CONSTRAINT fk_compra_aluno
FOREIGN KEY (Aluno) REFERENCES Aluno(Id_Aluno);

CREATE TABLE Senha (
    Id_Senha INT AUTO_INCREMENT PRIMARY KEY,
    Compra INT NOT NULL,
    Estado INT NOT NULL,
    Preco_Senha DECIMAL(10,2) NOT NULL,
    Data_Validade_Senha DATETIME,
    Data_Validacao_Senha DATETIME NULL,
    Auxiliar INT NULL
);

ALTER TABLE Senha
ADD CONSTRAINT fk_senha_compra
FOREIGN KEY (Compra) REFERENCES Compra(Id_Compra);

ALTER TABLE Senha
ADD CONSTRAINT fk_senha_estado
FOREIGN KEY (Estado) REFERENCES Estado(Id_Estado);

ALTER TABLE Senha
ADD CONSTRAINT fk_senha_auxiliar
FOREIGN KEY (Auxiliar) REFERENCES Auxiliar(Id_Auxiliar);

CREATE TABLE Validacao (
    Id_Validacao INT AUTO_INCREMENT PRIMARY KEY,
    Cartao INT NOT NULL,
    Aluno INT NOT NULL,
    Resultado_Validacao ENUM('Valido','Invalido') NOT NULL,
    Data_Hora_Validacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE Validacao
ADD CONSTRAINT fk_validacao_cartao
FOREIGN KEY (Cartao) REFERENCES Cartao(Id_Cartao);

ALTER TABLE Validacao
ADD CONSTRAINT fk_validacao_aluno
FOREIGN KEY (Aluno) REFERENCES Aluno(Id_Aluno);

CREATE TABLE Turno_Auxiliar (
    id_auxiliar INT,
    id_turno INT,
    PRIMARY KEY (id_auxiliar, id_turno)
);

ALTER TABLE Turno_Auxiliar
ADD CONSTRAINT fk_turno_auxiliar_auxiliar
FOREIGN KEY (id_auxiliar) REFERENCES Auxiliar(Id_Auxiliar);

ALTER TABLE Turno_Auxiliar
ADD CONSTRAINT fk_turno_auxiliar_turno
FOREIGN KEY (id_turno) REFERENCES Turno(Id_Turno);

SET FOREIGN_KEY_CHECKS = 1;
