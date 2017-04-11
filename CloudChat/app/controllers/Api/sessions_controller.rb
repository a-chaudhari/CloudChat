class Api::SessionsController < ApplicationController
  def create
    user = User.find_by_credentials(params[:username], params[:password])
    if user
      @current_user = user
      session[:session_token] = user.reset_session_token!
      render partial: "api/session/user_session", locals: {user:user}
    else
      render json: {"errors"=>"invalid credentials"}, status: 422
    end
  end

  def destroy
    if logged_in?
      session[:session_token] = nil
      current_user.reset_session_token!
      @current_user = nil
    end
    render json: {}
  end

end
